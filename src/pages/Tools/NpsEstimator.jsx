// pages/nps-estimator.jsx

import { useState } from "react";
import NpsEstimatorForm from "../../components/Tools/NPSvsUPS/NpsEstimatorForm";
// import NpsResultTable from '@/components/NpsEstimator/NpsResultTable';
import { calculateNpsProjection } from "../../components/Tools/NPSvsUPS/NpsCalculator";
import payMatrixData from "../../data/payMatrixData";
// import NpsResultTable from "../../components/Tools/NPSvsUPS/NpsResultTable";
import NpsUpsSummary from "../../components/Tools/NPSvsUPS/NpsUpsSummary";
import NpsTableAccordion from "../../components/Tools/NPSvsUPS/NpsTableAccordion";
import SimulationGuide from "../../components/Tools/NPSvsUPS/SimulationGuide";
import { Helmet } from "react-helmet-async";
import PageFeedback from "../../components/PageFeedback";
import VrsSummary from "../../components/Tools/NPSvsUPS/VrsSummary";

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
    <div className="max-w-6xl mx-auto px-4 pt-8 space-y-2">
      <Helmet>
        <title>
          NPS vs UPS Estimator | Pension Comparison Tool | UnderSigned
        </title>
        <meta
          name="description"
          content="Compare retirement benefits between the National Pension Scheme (NPS) and the Old Pension Scheme (UPS) with personalized calculations and insights."
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/public/nps-or-ups"
        />
      </Helmet>

      <h1 className="text-xl md:text-2xl font-extrabold text-center text-blue-800">
        Compare Your Retirement Options{" "}
        <span className="block">NPS or UPS</span>
      </h1>
      <p className="text-center text-gray-700 text-sm sm:text-base">
        Explore how your pension and retirement benefits may shape up under both
        schemes. Adjust key assumptions and make informed decisions with this
        interactive estimator.
      </p>

      {/* User Input Form */}
      <div className="bg-white p-6 rounded shadow">
        <NpsEstimatorForm
          payMatrixData={payMatrixData}
          onSubmit={handleEstimate}
        />
      </div>

      {/* Summary after calculation */}
      {results.length > 0 && (
        <div className="transition-all duration-700 ease-out animate-fade-in">
          <NpsUpsSummary
            data={results}
            joiningDate={submittedFormData?.joiningDate}
          />
          {/* NEW: VRS-focused summary */}
          <div className="mt-6">
            <VrsSummary
              data={results}
              joiningDate={submittedFormData?.joiningDate}
              dob={submittedFormData?.dob} // ensure your form provides this
            />
          </div>
        </div>
      )}

      {/* <VrsSummary /> */}

      <PageFeedback pageSlug="/NPS vs UPS" />

      {/* Toggle Table Button */}
      {results.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setShowTable(!showTable)}
            className="mt-4 px-6 py-2 bg-blue-600 text-sm md:text-base text-white rounded hover:bg-blue-700 transition"
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

      <div>
        <SimulationGuide />
      </div>
    </div>
  );
};

export default NpsEstimator;
