import PYQYearVisibility from "./PYQYearVisibility";
import { SERVER_ORIGIN } from "../../util/serverConfig.js";
// export default AddQuestionForm;
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TOPIC_OPTIONS = {
  "Paper I": [
    "Constitution",
    "AoBR",
    "RTI Act",
    "Parliamentary Procedure",
    "Current Affairs",
    "General Studies",
    "Economy",
    "Govt Schemes",
  ],
  "Paper II": [
    "FR-SR",
    "Leave Rules",
    "Pension Rules",
    "CCA Rules",
    "Conduct Rules",
    "LTC Rules",
    "Office Procedure (CSMOP)",
    "Travelling Allowance",
    "GFR",
    "NPS",
    "DFPR",
    "Misc. Allowances",
    "Parliamentary Procedure",
    "Others",
  ],
};

const AddQuestionForm = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [year, setYear] = useState("2023");
  const [availableYears, setAvailableYears] = useState([
    "2015", "2016-17", "2018", "2019-20", "2021-22", "2023", "2024", "2025",
  ]);
  const [paperType, setPaperType] = useState("Paper I");

  // listing & filters
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyUncategorized, setShowOnlyUncategorized] = useState(false);

  // add/edit (top form)
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [topicCategory, setTopicCategory] = useState("");

  // inline categorize (per-row)
  const [categorizingId, setCategorizingId] = useState(null);
  const [categorizeValue, setCategorizeValue] = useState("");
  const [categorizeSaving, setCategorizeSaving] = useState(false);

  // misc
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);

  const token = localStorage.getItem("jwtToken");
  // const BASE_URL = "http://localhost:5000/api/v1/";
  const BASE_URL = (SERVER_ORIGIN + "/api/v1/");

  // auth + fetch on inputs
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.userType === "Admin");
    } else setIsAdmin(false);
  }, [token]);

  useEffect(() => {
    fetchQuestions();
  }, [year, paperType, currentPage, searchTerm, showOnlyUncategorized]);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuestions([]);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(
        `${BASE_URL}prevYearManagement/questions/${year}/${paperType}`,
        config,
      );

      let filtered = response.data || [];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((q) =>
          q.questionText?.toLowerCase().includes(term),
        );
      }

      if (showOnlyUncategorized) {
        filtered = filtered.filter(
          (q) => !q.topicCategory || q.topicCategory === "",
        );
      }

      setQuestions(filtered);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (i, val) => {
    const next = [...options];
    next[i] = val;
    setOptions(next);
  };

  const resetForm = () => {
    setEditingQuestionId(null);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setExplanation("");
    setTopicCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!options.includes(correctAnswer)) {
      alert("The correct answer must match one of the options.");
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingQuestionId) {
        await axios.put(
          `${BASE_URL}prevYearManagement/question/${editingQuestionId}`,
          { questionText, options, correctAnswer, explanation, topicCategory },
          config,
        );
        alert("Question updated successfully!");
      } else {
        await axios.post(
          `${BASE_URL}prevYearManagement/add-question/${year}/${paperType}`,
          { questionText, options, correctAnswer, explanation, topicCategory },
          config,
        );
        alert("Question added successfully!");
      }
      resetForm();
      fetchQuestions();
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Error saving question");
    }
    setLoading(false);
  };

  const handleEdit = (q) => {
    setEditingQuestionId(q._id);
    setQuestionText(q.questionText || "");
    setOptions(q.options?.length ? q.options : ["", "", "", ""]);
    setCorrectAnswer(q.correctAnswer || "");
    setExplanation(q.explanation || "");
    setTopicCategory(q.topicCategory || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(
        `${BASE_URL}prevYearManagement/question/${id}`,
        config,
      );
      alert("Question deleted successfully!");
      fetchQuestions();
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Error deleting question");
    }
    setLoading(false);
  };

  // --- Inline categorize ---
  const startCategorize = (q) => {
    setCategorizingId(q._id);
    setCategorizeValue(q.topicCategory || "");
  };

  const cancelCategorize = () => {
    setCategorizingId(null);
    setCategorizeValue("");
  };

  const saveCategorize = async () => {
    if (!categorizingId) return;
    setCategorizeSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `${BASE_URL}prevYearManagement/question/${categorizingId}`,
        { topicCategory: categorizeValue },
        config,
      );
      // Optimistic UI update
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === categorizingId
            ? { ...q, topicCategory: categorizeValue }
            : q,
        ),
      );
      cancelCategorize();
    } catch (err) {
      console.error("Error updating topic:", err);
      alert("Failed to update topic");
    }
    setCategorizeSaving(false);
  };

  // pagination
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);

  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4">
        <span className="text-3xl bg-red-100 text-red-800 py-6 px-4 rounded">
          Unauthorized Access
        </span>
        <a href="/" className="text-blue-500 text-xl underline">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header controls */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="pyq-admin-year" className="block mb-1 font-medium">Year</label>
            <select
              id="pyq-admin-year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border rounded"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Paper Type</label>
            <select
              value={paperType}
              onChange={(e) => {
                setPaperType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="Paper I">Paper I</option>
              <option value="Paper II">Paper II</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border rounded"
              placeholder="Search questions..."
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOnlyUncategorized}
              onChange={(e) => {
                setShowOnlyUncategorized(e.target.checked);
                setCurrentPage(1);
              }}
            />
            Show uncategorized only
          </label>
        </div>
      </div>

      <PYQYearVisibility year={year} onYearsLoaded={setAvailableYears} />

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          {editingQuestionId ? "Edit Question" : "Add Question"}
        </h2>

        <div>
          <label className="block mb-1 font-medium">Topic</label>
          <select
            value={topicCategory}
            onChange={(e) => setTopicCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Topic --</option>
            {TOPIC_OPTIONS[paperType].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Question Text</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Enter the question..."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Options</label>
          {options.map((opt, i) => (
            <input
              key={i}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder={`Option ${i + 1}`}
            />
          ))}
        </div>

        <div>
          <label className="block mb-1 font-medium">Correct Answer</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Must match one of the options"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Explanation</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full p-2 border rounded h-20"
            placeholder="Add explanation (optional)"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingQuestionId ? "Update Question" : "Add Question"}
          </button>
        </div>
      </form>

      {/* Questions List */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Questions List
        </h2>

        {loading && <p className="text-center">Loading...</p>}

        <ul className="space-y-4">
          {currentQuestions.map((q) => (
            <li
              key={q._id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <p className="font-medium text-gray-800">{q.questionText}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600">
                  Topic:&nbsp;
                  <span className="font-medium">
                    {q.topicCategory && q.topicCategory !== ""
                      ? q.topicCategory
                      : "—"}
                  </span>
                </span>

                {/* Inline Categorize control */}
                {categorizingId === q._id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={categorizeValue}
                      onChange={(e) => setCategorizeValue(e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="">-- Select Topic --</option>
                      {TOPIC_OPTIONS[paperType].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={saveCategorize}
                      disabled={categorizeSaving}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                    >
                      {categorizeSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelCategorize}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startCategorize(q)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Categorize
                  </button>
                )}

                <div className="ml-auto flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(q)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(q._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={`px-3 py-1 border rounded ${
                currentPage === n
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddQuestionForm;
