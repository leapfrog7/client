import { useState } from "react";
import PropTypes from "prop-types";

const NpsEstimatorForm = ({ payMatrixData, onSubmit }) => {
  const [formData, setFormData] = useState({
    payLevel: "",
    payCell: "",
    incrementMonth: "January",
    daRate: "",
    expectedDaIncreaseRate: "",
    employeeContribution: 10,
    employerContribution: 14,
    dob: "",
    joiningDate: "",
    currentCorpus: "",
    expectedReturn: 8,
    payCommissionHikePercent: 10,
    enablePayCommission: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);
    if (onSubmit) {
      onSubmit(formData); // 🔁 Triggers the calculator in NpsEstimator.jsx
    }
  };

  return (
    <form className="p-0 bg-white rounded space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">NPS Estimator Form</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Pay Level */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Pay Level</label>
          <select
            name="payLevel"
            value={formData.payLevel}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Pay Level</option>
            {Object.keys(payMatrixData).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Pay Cell */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Pay Cell</label>
          <select
            name="payCell"
            value={formData.payCell}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!formData.payLevel}
          >
            <option value="">Select Pay Cell</option>
            {(payMatrixData[formData.payLevel] || []).map((cell, index) => (
              <option key={index} value={cell}>
                ₹{cell.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Increment Month */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">
            Increment Month
          </label>
          <select
            name="incrementMonth"
            value={formData.incrementMonth}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="January">January</option>
            <option value="July">July</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
        {/* DA Rate */}
        <div className="flex flex-col">
          <label htmlFor="daRate" className="font-semibold text-gray-700 mb-1">
            Current DA Rate (%)
          </label>
          <input
            type="number"
            name="daRate"
            id="daRate"
            value={formData.daRate}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Expected DA Increase Rate */}
        <div className="flex flex-col">
          <label
            htmlFor="expectedDaIncreaseRate"
            className="font-semibold text-gray-700 mb-1"
          >
            Expected DA Increase (% every 6 months)
          </label>
          <input
            type="number"
            name="expectedDaIncreaseRate"
            id="expectedDaIncreaseRate"
            value={formData.expectedDaIncreaseRate}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col">
          <label htmlFor="dob" className="font-semibold text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Joining Date */}
        <div>
          <label
            htmlFor="joiningDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Joining NPS
          </label>
          <input
            type="date"
            name="joiningDate"
            id="joiningDate"
            value={formData.joiningDate || ""}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>Expected Pay Commission Hike (%)</label>
          <input
            type="number"
            name="payCommissionHikePercent"
            value={formData.payCommissionHikePercent}
            onChange={handleChange}
            placeholder="e.g. 15% or 20%..."
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>Current NPS Corpus (₹)</label>
          <input
            type="number"
            name="currentCorpus"
            value={formData.currentCorpus}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>Expected NPS Annual Return (%)</label>
          <input
            type="number"
            name="expectedReturn"
            value={formData.expectedReturn}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>Employee Contribution (%)</label>
          <input
            type="number"
            name="employeeContribution"
            value={formData.employeeContribution}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>Employer Contribution (%)</label>
          <input
            type="number"
            name="employerContribution"
            value={formData.employerContribution}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="enablePayCommission"
            checked={formData.enablePayCommission}
            onChange={handleChange}
          />
          Assume Pay Commission Hike Every 10 Years
        </label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Estimate
      </button>
    </form>
  );
};

NpsEstimatorForm.propTypes = {
  payMatrixData: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NpsEstimatorForm;
