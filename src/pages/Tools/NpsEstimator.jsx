// pages/nps-estimator.jsx

import { useState } from "react";
import NpsEstimatorForm from "../../components/Tools/NPSvsUPS/NpsEstimatorForm";
// import NpsResultTable from '@/components/NpsEstimator/NpsResultTable';
import { calculateNpsProjection } from "../../components/Tools/NPSvsUPS/NpsCalculator";
import payMatrixData from "../../data/payMatrixData";
// import NpsResultTable from "../../components/Tools/NPSvsUPS/NpsResultTable";
import NpsUpsSummary from "../../components/Tools/NPSvsUPS/NpsUpsSummary";
import NpsTableAccordion from "../../components/Tools/NPSvsUPS/NpsTableAccordion";

// import NpsCalculator from "../../components/Tools/NPSvsUPS/NpsCalculator";

const NpsEstimator = () => {
  const [results, setResults] = useState([]);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [showTable, setShowTable] = useState(false); // NEW

  const handleEstimate = (formData) => {
    const simulationResults = calculateNpsProjection(formData, payMatrixData);
    setResults(simulationResults);
    setSubmittedFormData(formData);
    setShowTable(false); // reset on new simulation
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-800">
        NPS vs UPS Estimator
      </h1>

      {/* User Input Form */}
      <div className="bg-white p-6 rounded shadow">
        <NpsEstimatorForm
          payMatrixData={payMatrixData}
          onSubmit={handleEstimate}
        />
      </div>

      {/* Summary after calculation */}
      {results.length > 0 && (
        <NpsUpsSummary
          data={results}
          joiningDate={submittedFormData?.joiningDate}
        />
      )}

      {/* Toggle Table Button */}
      {results.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setShowTable(!showTable)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showTable
              ? "Hide Monthly Projection Table"
              : "Show Monthly Projection Table"}
          </button>
        </div>
      )}

      {/* Accordion Table */}
      {results.length > 0 && showTable && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Monthly Projection (NPS vs UPS)
          </h2>
          <NpsTableAccordion data={results} />
        </div>
      )}
    </div>
  );
};

export default NpsEstimator;
