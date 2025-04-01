import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1/cghsUnitManagement";
// const BASE_URL = "http://localhost:5000/api/v1/cghsUnitManagement";

const EditCghsUnitModal = ({ isOpen, onClose, unit, onUpdate }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googlePreview, setGooglePreview] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (unit) {
      setFormData({
        ...unit,
        empanelledForText: unit.empanelledFor?.join(", ") || "",
      });
    }
  }, [unit]);

  if (!isOpen || !formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields (address.*, contact.*, validity.*)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      empanelledFor: formData.empanelledForText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await axios.put(`${BASE_URL}/${unit._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(); // Refresh list in parent
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating unit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRefresh = async () => {
    if (!unit?._id) return;
    setIsRefreshing(true);
    setRefreshError("");

    try {
      const res = await fetch(`${BASE_URL}/${unit._id}/fetchGoogleData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const { msg } = await res.json();
        throw new Error(msg || "Failed to fetch");
      }

      const data = await res.json();
      setGooglePreview(data);
    } catch (err) {
      setRefreshError(err.message || "Something went wrong");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUsePreviewData = (preview) => {
    const updated = {
      ...formData,
      googleData: preview.googleData,
      geoLocation: preview.geoLocation,
      googleMapsUrl: preview.googleMapsUrl,
    };

    setFormData(updated);
    setGooglePreview(null); // Optional: clear preview after applying
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit CGHS Unit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Unit Name"
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="Hospital">Hospital</option>
              <option value="Lab">Lab</option>
            </select>

            <select
              name="accreditation"
              value={formData.accreditation}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="NABH">NABH</option>
              <option value="Non-NABH">Non-NABH</option>
              <option value="NABL">NABL</option>
              <option value="Non-NABL">Non-NABL</option>
            </select>

            <input
              type="text"
              name="cghsCode"
              value={formData.cghsCode}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="CGHS Code (Optional)"
            />

            <input
              type="text"
              name="contact.phone"
              value={formData.contact?.phone || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Phone"
            />

            <input
              type="text"
              name="contact.email"
              value={formData.contact?.email || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Email"
            />

            <input
              type="text"
              name="contact.website"
              value={formData.contact?.website || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Website"
            />

            <input
              type="text"
              name="address.line1"
              value={formData.address?.line1 || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Address Line 1"
            />

            <input
              type="text"
              name="address.line2"
              value={formData.address?.line2 || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Address Line 2"
            />

            <input
              type="text"
              name="address.city"
              value={formData.address?.city || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="City"
            />

            <input
              type="text"
              name="address.state"
              value={formData.address?.state || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="State"
            />

            <input
              type="text"
              name="address.pincode"
              value={formData.address?.pincode || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Pincode"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Empanelled For</label>
            <textarea
              name="empanelledForText"
              value={formData.empanelledForText}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Cardiology, Nephrology, Radiology..."
              rows={3}
            />
          </div>

          {googlePreview && (
            <div className="mt-4 p-4 border rounded bg-gray-50 text-sm">
              <h3 className="font-semibold mb-2 text-blue-700">
                🔍 Previewed Google Info (Not Saved)
              </h3>

              <p>
                <strong>📍 Maps URL:</strong>{" "}
                <a
                  href={googlePreview.googleMapsUrl}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Open in Maps
                </a>
              </p>

              {googlePreview.googleData?.rating && (
                <p>
                  <strong>⭐ Rating:</strong> {googlePreview.googleData.rating}{" "}
                  ({googlePreview.googleData.userRatingsTotal} reviews)
                </p>
              )}

              {googlePreview.googleData?.formattedPhoneNumber && (
                <p>
                  <strong>📞 Phone (Google):</strong>{" "}
                  {googlePreview.googleData.formattedPhoneNumber}
                </p>
              )}

              {googlePreview.googleData?.website && (
                <p>
                  <strong>🌐 Website:</strong>{" "}
                  <a
                    href={googlePreview.googleData.website}
                    className="text-blue-500 underline"
                    target="_blank"
                  >
                    Visit
                  </a>
                </p>
              )}

              {googlePreview.googleData?.openingHours?.length > 0 && (
                <div>
                  <strong>🕒 Opening Hours:</strong>
                  <ul className="ml-6 list-disc">
                    {googlePreview.googleData.openingHours.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => handleUsePreviewData(googlePreview)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                ✅ Use This Data
              </button>
            </div>
          )}

          {refreshError && (
            <p className="text-red-500 mt-2 text-sm">❌ {refreshError}</p>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleGoogleRefresh}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm flex items-center gap-1"
              disabled={isRefreshing}
            >
              🔄 Refresh Google Info
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditCghsUnitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  unit: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
};

export default EditCghsUnitModal;
