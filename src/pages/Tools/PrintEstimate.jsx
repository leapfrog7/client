import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PrintEstimate = () => {
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState([]);
  const [city, setCity] = useState("Delhi");
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cghsEstimate")) || {};
    if (!data.items || data.items.length === 0) {
      navigate("/pages/public/cghs-rates");
      return;
    }

    setEstimate(data.items);
    setCity(data.selectedCity || "Delhi");
    setTimestamp(data.timestamp || new Date().toISOString());
  }, [navigate]);

  const totalNabh = estimate.reduce((sum, i) => sum + i.nabhRate, 0);
  const totalNonNabh = estimate.reduce((sum, i) => sum + i.nonNabhRate, 0);

  return (
    <div className="print-container relative p-6 max-w-3xl mx-auto font-sans bg-white print:bg-white min-h-screen">
      {/* Watermark */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none flex justify-center items-center print:opacity-10">
        <img src="/favicon.png" alt="Watermark" className="w-3/4" />
      </div>

      {/* Logo and Header */}
      <div className="relative z-10 mb-6 flex flex-col items-center print:items-start">
        <img src="/favicon.png" alt="CGHS Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-xl font-bold text-blue-800">
          Central Government Health Scheme (CGHS)
        </h1>
        <p className="text-sm text-gray-600">
          Estimate of Test/Procedure Charges
        </p>
      </div>

      {/* Meta Info */}
      <div className="relative z-10 text-sm text-gray-700 mb-6">
        <p>
          📍 City: <strong>{city}</strong>
        </p>
        <p>
          👤 Beneficiary Category: <strong>Semi-Private</strong>
        </p>
        <p>📅 Generated on: {new Date(timestamp).toLocaleString("en-IN")}</p>
      </div>

      {/* Table */}
      <div className="relative z-10">
        <table className="w-full border-collapse text-sm mb-6">
          <thead className="bg-gray-100 text-gray-700 border">
            <tr>
              <th className="border px-3 py-2 text-left w-[50%]">
                Test / Procedure
              </th>
              <th className="border px-3 py-2 text-center">Non-NABH (₹)</th>
              <th className="border px-3 py-2 text-center">NABH (₹)</th>
            </tr>
          </thead>
          <tbody>
            {estimate.map((item, idx) => (
              <tr key={item._id} className="border-t text-gray-800">
                <td className="border px-3 py-2 align-top">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {idx + 1}. {item.name}
                    </span>
                    {item.cghsCode && (
                      <span className="text-xs text-blue-600 mt-1">
                        CGHS Code: {item.cghsCode}
                      </span>
                    )}
                  </div>
                </td>

                <td className="border px-3 py-2 text-center">
                  ₹{item.nonNabhRate.toLocaleString("en-IN")}
                </td>
                <td className="border px-3 py-2 text-center">
                  ₹{item.nabhRate.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50 font-semibold border-t">
            <tr>
              <td className="text-right px-3 py-2">Total</td>
              <td className="text-center px-3 py-2 text-green-700">
                ₹{totalNonNabh.toLocaleString("en-IN")}
              </td>
              <td className="text-center px-3 py-2 text-green-700">
                ₹{totalNabh.toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Disclaimer */}
      <p className="relative z-10 text-xs text-gray-500 text-center print:text-left mt-8">
        ⚠️ <strong>Note:</strong> Diagnostic tests are charged as per
        semi-private rates. Procedural charges may vary based on beneficiary
        category.
      </p>

      {/* Buttons (hidden on print) */}
      <div className="relative z-10 flex justify-between items-center mt-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          🖨️ Print Now
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            margin: 0 !important;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          .print-container, .print-container * {
            visibility: visible;
          }

          .print-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: white;
          }

          header, footer, nav, .page-feedback {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintEstimate;
