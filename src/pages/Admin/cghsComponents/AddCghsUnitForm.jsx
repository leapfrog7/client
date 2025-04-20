import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const validCities = [
  "Delhi",
  "Gurugram",
  "Faridabad",
  "Ghaziabad",
  "Noida",
  // "Mumbai",
  // "Chennai",
  // "Kolkata",
  // "Hyderabad",
  // "Bhopal",
  // "Indore",
  // "Bengaluru",
];

const AddCghsUnitForm = ({ fetchUnits }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Hospital",
    accreditation: "NABH",
    empanelledFor: "",
    address: {
      line1: "",
      line2: "",
      city: validCities[0],
      state: "",
      pincode: "",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    cghsCode: "",
    validity: {
      from: "",
      to: "",
    },
    status: "Active",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("jwtToken");
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/cghsUnitManagement";
  // const BASE_URL = "http://localhost:5000/api/v1/cghsUnitManagement";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("contact.")) {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("validity.")) {
      setFormData((prev) => ({
        ...prev,
        validity: { ...prev.validity, [name.split(".")[1]]: value },
      }));
    } else if (name === "empanelledForText") {
      setFormData((prev) => ({
        ...prev,
        empanelledForText: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Convert textarea input to an array
    const formattedEmpanelledFor = (formData.empanelledForText || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Prepare payload
    const payload = {
      ...formData,
      empanelledFor: formattedEmpanelledFor,
    };

    try {
      await axios.post(`${BASE_URL}/addCghsUnit`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("CGHS Unit added successfully.");

      // Reset form
      setFormData({
        name: "",
        type: "Hospital",
        accreditation: "NABH",
        empanelledForText: "", // Reset this too
        address: {
          line1: "",
          line2: "",
          city: validCities[0],
          state: "",
          pincode: "",
        },
        contact: {
          phone: "",
          email: "",
          website: "",
        },
        cghsCode: "",
        validity: {
          from: "",
          to: "",
        },
        status: "Active",
        notes: "",
      });

      // Refresh list
      if (fetchUnits) fetchUnits();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded shadow"
    >
      <div>
        <label className="block font-semibold">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        >
          <option value="Hospital">Hospital</option>
          <option value="Lab">Lab</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold">Accreditation</label>
        <select
          name="accreditation"
          value={formData.accreditation}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        >
          <option value="NABH">NABH</option>
          <option value="Non-NABH">Non-NABH</option>
          <option value="NABL">NABL</option>
          <option value="Non-NABL">Non-NABL</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Empanelled For</label>
        <textarea
          name="empanelledForText"
          value={formData.empanelledForText || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          placeholder="Cardiology, Nephrology, Radiology..."
          rows={3}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold">Address Line 1</label>
        <input
          name="address.line1"
          value={formData.address.line1}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold">Address Line 2</label>
        <input
          name="address.line2"
          value={formData.address.line2}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">City</label>
        <select
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        >
          {validCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">State</label>
        <input
          name="address.state"
          value={formData.address.state}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Pincode</label>
        <input
          name="address.pincode"
          value={formData.address.pincode}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Phone</label>
        <input
          name="contact.phone"
          value={formData.contact.phone}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Email</label>
        <input
          name="contact.email"
          type="email"
          value={formData.contact.email}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Website</label>
        <input
          name="contact.website"
          value={formData.contact.website}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">CGHS Code</label>
        <input
          name="cghsCode"
          value={formData.cghsCode}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Validity From</label>
        <input
          name="validity.from"
          type="date"
          value={formData.validity.from}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Validity To</label>
        <input
          name="validity.to"
          type="date"
          value={formData.validity.to}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        >
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      <div className="md:col-span-2 flex items-center justify-between mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Add CGHS Unit"}
        </button>
        {message && <p className="text-sm text-green-600 ml-4">{message}</p>}
      </div>
    </form>
  );
};

AddCghsUnitForm.propTypes = {
  fetchUnits: PropTypes.func,
};

export default AddCghsUnitForm;
