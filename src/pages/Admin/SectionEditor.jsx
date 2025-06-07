import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BASE_URL = "https://server-v4dy.onrender.com";
// const BASE_URL = "http://localhost:5000";

const SectionEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState({
    chapterTitle: "",
    ruleNumber: "",
    ruleTitle: "",
    contentBlocks: [],
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  console.log("SectionEditor mounted with slug:", slug);
  const [editSectionIndex, setEditSectionIndex] = useState(null);

  const fetchRule = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/public/resources/${slug}`
      );
      setRule(res.data);
    } catch (err) {
      toast.error("Failed to load rule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRule();
  }, [slug]);

  const handleAddBlock = (type) => {
    const defaultValue = type === "table" ? [["", ""]] : "";
    const block = { type, value: defaultValue, caption: "", link: "" };
    setNewSection((prev) => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, block],
    }));
  };

  const handleBlockChange = (index, field, value) => {
    const updatedBlocks = [...newSection.contentBlocks];
    updatedBlocks[index][field] = value;
    setNewSection({ ...newSection, contentBlocks: updatedBlocks });
  };

  const filteredSections =
    rule?.sections?.filter((section) => {
      if (searchTerm.length < 3) return true;

      const lower = searchTerm.toLowerCase();

      const inMetadata =
        section.ruleNumber?.toLowerCase().includes(lower) ||
        section.ruleTitle?.toLowerCase().includes(lower) ||
        section.chapterTitle?.toLowerCase().includes(lower);

      const inBlocks = section.contentBlocks?.some(
        (block) =>
          (block.type === "text" || block.type === "note") &&
          block.value?.toLowerCase().includes(lower)
      );

      return inMetadata || inBlocks;
    }) ?? []; // default to empty array if rule is null

  //Pagination Code
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 5;

  // const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);

  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) buttons.push(i);
      if (currentPage < totalPages - 2) buttons.push("...");
      buttons.push(totalPages);
    }

    return buttons;
  };

  const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);

  const paginatedSections = filteredSections.slice(
    (currentPage - 1) * sectionsPerPage,
    currentPage * sectionsPerPage
  );

  const handleSubmitSection = async () => {
    try {
      const updatedSections = [...(rule.sections || [])];

      if (editSectionIndex !== null) {
        // Update existing section at given index
        updatedSections[editSectionIndex] = newSection;
      } else {
        // Add new section
        updatedSections.push(newSection);
      }

      const updatedRule = {
        ...rule,
        sections: updatedSections,
      };
      console.log("SUBMITTING section payload:", newSection.contentBlocks);

      await axios.put(
        `${BASE_URL}/api/v1/resourceManagement/${slug}`,
        updatedRule,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        editSectionIndex !== null ? "Section updated" : "Section added"
      );

      // Reset form and state
      setNewSection({
        chapterTitle: newSection.chapterTitle, // ✅ retain chapter
        ruleNumber: "",
        ruleTitle: "",
        contentBlocks: [],
      });
      setEditSectionIndex(null); // reset edit mode
      fetchRule(); // reload data
    } catch (err) {
      toast.error("Failed to save section");
    }
  };

  const handleRemoveBlock = (indexToRemove) => {
    const updatedBlocks = newSection.contentBlocks.filter(
      (_, i) => i !== indexToRemove
    );
    setNewSection({ ...newSection, contentBlocks: updatedBlocks });
  };

  const handleEditSection = (index) => {
    const sec = rule.sections[index];

    setNewSection({
      chapterTitle: sec.chapterTitle || "",
      ruleNumber: sec.ruleNumber || "",
      ruleTitle: sec.ruleTitle || "",
      contentBlocks: sec.contentBlocks,
    });
    setEditSectionIndex(index);
  };

  const handleDeleteSection = async (indexToRemove) => {
    try {
      const updatedSections = rule.sections.filter(
        (_, i) => i !== indexToRemove
      );

      const updatedRule = {
        ...rule,
        sections: updatedSections,
      };

      await axios.put(
        `${BASE_URL}/api/v1/resourceManagement/${slug}`,
        updatedRule,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Section deleted");
      fetchRule(); // refresh the list
    } catch (err) {
      toast.error("Failed to delete section");
    }
  };

  const toggleSectionExpansion = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading || !rule) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Sections – {rule.title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-2 mb-6">
        <input
          placeholder="Chapter Title (optional)"
          className="border p-2 rounded w-full"
          value={newSection.chapterTitle}
          onChange={(e) =>
            setNewSection({ ...newSection, chapterTitle: e.target.value })
          }
        />
        <input
          placeholder="Rule Number (e.g., Rule 5)"
          className="border p-2 rounded w-full"
          value={newSection.ruleNumber}
          onChange={(e) =>
            setNewSection({ ...newSection, ruleNumber: e.target.value })
          }
        />
        <input
          placeholder="Rule Title (optional)"
          className="border p-2 rounded w-full"
          value={newSection.ruleTitle}
          onChange={(e) =>
            setNewSection({ ...newSection, ruleTitle: e.target.value })
          }
        />

        <div className="space-x-2">
          <button
            onClick={() => handleAddBlock("text")}
            className="px-2 py-1 bg-blue-100 rounded"
          >
            + Text
          </button>
          <button
            onClick={() => handleAddBlock("table")}
            className="px-2 py-1 bg-green-100 rounded"
          >
            + Table
          </button>
          <button
            onClick={() => handleAddBlock("note")}
            className="px-2 py-1 bg-yellow-100 rounded"
          >
            + Note
          </button>
          <button
            onClick={() => handleAddBlock("reference")}
            className="px-2 py-1 bg-indigo-100 rounded"
          >
            + Reference
          </button>
          <button
            onClick={() => handleAddBlock("image")}
            className="px-2 py-1 bg-pink-100 rounded"
          >
            + Image
          </button>
        </div>

        {newSection.contentBlocks.map((block, index) => (
          <div key={index} className="border p-3 rounded mt-4 bg-gray-50">
            <p className="font-medium mb-2">
              Block {index + 1} – {block.type}
            </p>
            <button
              className="p-2 rounded mb-2 text-red-800 hover:underline text-xs bg-pink-100"
              onClick={() => handleRemoveBlock(index)}
            >
              Remove
            </button>
            {block.type === "text" || block.type === "note" ? (
              <div className="bg-white border rounded p-2">
                <ReactQuill
                  theme="snow"
                  value={block.value}
                  onChange={(content) =>
                    handleBlockChange(index, "value", content)
                  }
                  className="bg-white"
                  placeholder="Write your content here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }], // Headers
                      ["bold", "italic", "underline", "strike"], // Basic text formatting
                      [{ list: "ordered" }, { list: "bullet" }], // Lists
                      [{ script: "sub" }, { script: "super" }], // Subscript/superscript
                      [{ indent: "-1" }, { indent: "+1" }], // Indentation
                      [{ direction: "rtl" }], // Right-to-left
                      [{ size: ["small", false, "large", "huge"] }], // Font size
                      [{ color: [] }, { background: [] }], // Font color and background color
                      ["link", "image", "video"], // Media
                      ["blockquote", "code-block"], // Blockquotes and code blocks
                      ["clean"], // Remove formatting
                    ],
                  }}
                />
              </div>
            ) : block.type === "reference" ? (
              <div className="space-y-2">
                <input
                  placeholder="Reference Text"
                  className="border p-2 rounded w-full"
                  value={block.value}
                  onChange={(e) =>
                    handleBlockChange(index, "value", e.target.value)
                  }
                />
                <input
                  placeholder="Reference URL"
                  className="border p-2 rounded w-full"
                  value={block.link}
                  onChange={(e) =>
                    handleBlockChange(index, "link", e.target.value)
                  }
                />
              </div>
            ) : block.type === "image" ? (
              <div className="space-y-2">
                <div className="space-y-2">
                  <input
                    placeholder="Image URL"
                    className="border p-2 rounded w-full"
                    value={block.value}
                    onChange={(e) =>
                      handleBlockChange(index, "value", e.target.value)
                    }
                  />
                  {block.value && (
                    <div className="w-full overflow-hidden rounded border">
                      <img
                        src={block.value}
                        alt={block.caption || "Image preview"}
                        className="w-full object-contain max-h-64"
                      />
                    </div>
                  )}
                  <input
                    placeholder="Caption (optional)"
                    className="border p-2 rounded w-full"
                    value={block.caption}
                    onChange={(e) =>
                      handleBlockChange(index, "caption", e.target.value)
                    }
                  />
                </div>

                <input
                  placeholder="Caption"
                  className="border p-2 rounded w-full"
                  value={block.caption}
                  onChange={(e) =>
                    handleBlockChange(index, "caption", e.target.value)
                  }
                />
              </div>
            ) : block.type === "table" ? (
              <div className="overflow-x-auto border rounded p-2 bg-white">
                <table className="min-w-full text-sm">
                  <tbody>
                    {block.value.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, colIdx) => (
                          <td key={colIdx} className="p-1 border">
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => {
                                const newTable = [...block.value];
                                newTable[rowIdx][colIdx] = e.target.value;
                                handleBlockChange(index, "value", newTable);
                              }}
                              className="w-full border px-2 py-1"
                            />
                          </td>
                        ))}
                        <td className="pl-2">
                          <button
                            className="text-red-500 text-xs"
                            onClick={() => {
                              const newTable = [...block.value];
                              newTable.splice(rowIdx, 1);
                              handleBlockChange(index, "value", newTable);
                            }}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                      const colCount = block.value[0]?.length || 1;
                      const newRow = Array(colCount).fill("");
                      handleBlockChange(index, "value", [
                        ...block.value,
                        newRow,
                      ]);
                    }}
                  >
                    + Row
                  </button>
                  <button
                    className="text-sm text-green-600 hover:underline"
                    onClick={() => {
                      const newTable = block.value.map((row) => [...row, ""]);
                      handleBlockChange(index, "value", newTable);
                    }}
                  >
                    + Column
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}

        <button
          onClick={handleSubmitSection}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Section
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Existing Sections</h2>
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sections..."
            className="border p-2 rounded w-full"
          />
        </div>

        {rule.sections && rule.sections.length > 0 ? (
          <ul className="space-y-2">
            {paginatedSections.map((sec, idx) => {
              const actualIndex = (currentPage - 1) * sectionsPerPage + idx;

              return (
                <li
                  key={actualIndex}
                  className="bg-white border rounded p-3 shadow-sm space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {sec.ruleNumber} – {sec.ruleTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {sec.chapterTitle}
                      </p>
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => toggleSectionExpansion(actualIndex)}
                    >
                      {expandedSections[actualIndex]
                        ? "Hide content"
                        : "Show content"}
                    </button>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEditSection(actualIndex)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteSection(actualIndex)}
                    >
                      Delete
                    </button>
                  </div>

                  {expandedSections[actualIndex] && (
                    <div className="mt-2 space-y-3">
                      {sec.contentBlocks.map((block, bIdx) => {
                        if (block.type === "text" || block.type === "note") {
                          console.log(
                            `Block ${bIdx + 1} HTML value:`,
                            block.value
                          );
                        }

                        return (
                          <div
                            key={bIdx}
                            className="border p-2 rounded bg-gray-50"
                          >
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Block {bIdx + 1} – {block.type}
                            </p>

                            {block.type === "text" || block.type === "note" ? (
                              <div
                                className="prose max-w-none text-sm [&_p]:my-1"
                                dangerouslySetInnerHTML={{
                                  __html: block.value,
                                }}
                              />
                            ) : block.type === "image" ? (
                              <div>
                                <img
                                  src={block.value}
                                  alt={block.caption || "Image"}
                                  className="max-w-full max-h-64 rounded"
                                />
                                {block.caption && (
                                  <p className="text-xs text-gray-500 italic mt-1">
                                    {block.caption}
                                  </p>
                                )}
                              </div>
                            ) : block.type === "table" &&
                              Array.isArray(block.value) ? (
                              <table className="table-auto text-sm border">
                                <tbody>
                                  {block.value.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="border p-1">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : block.type === "reference" ? (
                              <a
                                href={block.link}
                                className="text-blue-600 underline text-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {block.value}
                              </a>
                            ) : (
                              <p className="text-gray-500 italic text-sm">
                                Unsupported block type
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No sections added yet.</p>
        )}
      </div>
      <div className="flex justify-center mt-6 space-x-1 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {getPaginationButtons().map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="px-2 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 border rounded ${
                currentPage === num
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          )
        )}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
