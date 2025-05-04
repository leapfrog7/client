import { useState } from "react";
import PropTypes from "prop-types";

const NpsEstimatorForm = ({ payMatrixData, onSubmit }) => {
  const [formData, setFormData] = useState({
    payLevel: "",
    payCell: "",
    incrementMonth: "January",
    daRate: "55",
    expectedDaIncreaseRate: "2",
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
    // Extract updated values
    const updatedValue = type === "checkbox" ? checked : value;
    const newFormData = { ...formData, [name]: updatedValue };

    // Validation: Date of Joining must be after Date of Birth
    if (
      (name === "dob" &&
        newFormData.joiningDate &&
        new Date(updatedValue) >= new Date(newFormData.joiningDate)) ||
      (name === "joiningDate" &&
        newFormData.dob &&
        new Date(updatedValue) <= new Date(newFormData.dob))
    ) {
      alert("Date of Joining must be after Date of Birth.");
      return;
    }

    setFormData(newFormData);
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
      <h2 className="text-base text-blue-800 font-semibold">
        Fill out the details
      </h2>

      <div className="shadow-md rounded p-3 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Pay Level */}
        <div className=" flex flex-col">
          <label className="text-sm md:text-base font-semibold text-gray-700 mb-1">
            Pay Level
          </label>
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
        <div className=" flex flex-col">
          <label className="text-sm md:text-base font-semibold text-gray-700 mb-1">
            Pay Cell
          </label>
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
          <label className=" text-sm md:text-base font-semibold text-gray-700 mb-1">
            Increment Month
          </label>
          <select
            name="incrementMonth"
            value={formData.incrementMonth}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="January">January</option>
            <option value="July">July</option>
          </select>
        </div>
      </div>

      <div className="shadow rounded px-3 py-2 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        {/* DA Rate */}
        <div className="flex flex-col">
          <label
            htmlFor="daRate"
            className="text-sm md:text-base font-semibold text-gray-700 mb-1"
          >
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
            className="text-sm md:text-base font-semibold text-gray-700 mb-1 lg:mt-3"
          >
            Expected DA Increase (% every 6 months):{" "}
            <span className="text-sm mt-1 text-blue-700 p-2 bg-blue-50  font-semibold  text-center">
              {formData.expectedDaIncreaseRate}%
            </span>
          </label>

          <input
            type="range"
            name="expectedDaIncreaseRate"
            id="expectedDaIncreaseRate"
            min={0}
            max={10}
            step={0.1}
            value={formData.expectedDaIncreaseRate}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="hidden">
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

        <div className="hidden">
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

      <div className="shadow rounded px-3 py-2 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        {/* Date of Birth */}
        <div className="flex flex-col">
          <label
            htmlFor="dob"
            className="text-sm md:text-base font-semibold text-gray-700 mb-1"
          >
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
            className="text-sm font-semibold md:text-base text-gray-700 mb-1 lg:mt-3 block "
          >
            Date of Joining Govt. Service
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
      </div>

      <div className="shadow rounded px-3 py-2 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        {/* Current NPS Corpus*/}
        <div>
          <label className="text-sm font-semibold md:text-base text-gray-700">
            Current NPS Corpus (₹)
          </label>
          <input
            type="number"
            name="currentCorpus"
            value={formData.currentCorpus}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Expected Return*/}

        <div>
          <label className="text-sm font-semibold md:text-base text-gray-700">
            Expected NPS Annual Return (%) :
          </label>
          <span className="text-sm mt-1 text-blue-700 font-semibold bg-blue-50 p-2 rounded text-center ml-2">
            {formData.expectedReturn}%
          </span>
          <input
            type="range"
            name="expectedReturn"
            min={2}
            max={20}
            step={0.1}
            value={formData.expectedReturn}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className=" space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
        {/*Pay Commission Hike */}
        <div className="text-sm md:text-base font-semibold  text-gray-700 shadow-md px-3 py-2">
          <label>Expected Pay Commission Hike (%) : </label>{" "}
          <span className="text-center text-blue-700 font-semibold p-2 bg-blue-50 rounded-md">
            {formData.payCommissionHikePercent}%
          </span>
          <input
            type="range"
            name="payCommissionHikePercent"
            id="payCommissionHikePercent"
            min={0}
            max={50}
            step={0.5}
            value={formData.payCommissionHikePercent}
            onChange={handleChange}
            // placeholder="e.g. 15% or 20%..."
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* These elements are hidden as they are unlikely to change */}
      <div className="hidden">
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

      <div className="text-center">
        <button
          type="submit"
          className="px-4 py-2 mt-6 bg-blue-800 text-white rounded min-w-48"
        >
          Prepare Estimate
        </button>
      </div>
      <span className="text-xs text-gray-500 pt-1 block text-center">
        Click on Prepare Estimate every time you change the input
      </span>
    </form>
  );
};

NpsEstimatorForm.propTypes = {
  payMatrixData: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NpsEstimatorForm;
