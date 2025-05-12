import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://server-v4dy.onrender.com";
// const BASE_URL = "http://localhost:5000";

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const titleInputRef = useRef(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    authority: "",
    type: "Rule",
    tags: "",
    image: "",
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/public/resources`);
      setResources(res.data);
    } catch (err) {
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (modalOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [modalOpen]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      authority: "",
      type: "Rule",
      tags: "",
      image: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
    };

    try {
      if (editId) {
        await axios.put(
          `${BASE_URL}/api/v1/resourceManagement/${payload.slug}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Resource updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/v1/resourceManagement`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Resource created successfully");
      }
      setModalOpen(false);
      fetchResources();
      resetForm();
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      authority: resource.authority,
      type: resource.type,
      tags: resource.tags.join(", "),
      image: resource.image || "",
    });
    setEditId(resource._id);
    setModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Resource Management</h1>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          + Add New Resource
        </button>
      </div>

      {modalOpen && (
        <div className="bg-white border rounded p-4 mb-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={titleInputRef}
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Rule Title"
              className="border p-2 rounded w-full"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="border p-2 rounded w-full"
            />
            <input
              name="authority"
              value={formData.authority}
              onChange={handleInputChange}
              placeholder="Issuing Authority"
              className="border p-2 rounded w-full"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              <option value="Rule">Rule</option>
              <option value="Act">Act</option>
              <option value="Manual">Manual</option>
              <option value="Circular">Circular</option>
              <option value="Order">Order</option>
            </select>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Comma-separated tags"
              className="border p-2 rounded w-full"
            />
            <input
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Image URL (optional)"
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editId ? "Update Resource" : "Create Resource"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Nodal Authority</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Tags</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => (
                <tr key={res._id} className="border-t border-gray-200">
                  <td className="p-3">{res.title}</td>
                  <td className="p-3">{res.authority || "-"}</td>
                  <td className="p-3">{res.type}</td>
                  <td className="p-3">{res.tags.join(", ")}</td>
                  <td className="p-3 flex gap-2 flex-col md:flex-row items-center justify-center">
                    <button
                      className="text-blue-600 hover:underline mr-2 bg-blue-100 px-4 py-2 rounded"
                      onClick={() => handleEdit(res)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-purple-600 hover:underline bg-purple-100 px-4 py-2 rounded"
                      onClick={() =>
                        navigate(`../resourceMgmt/${res.slug}/sections`)
                      }
                    >
                      See Sections
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
