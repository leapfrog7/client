import { useState } from "react";
import PropTypes from "prop-types";

export default function AddToReportButton({
  result,
  type,
  title,
  summaryText = "",
  tableRows = [],
  tableHeaders = [],
  onAddToReport,
}) {
  const [isAdded, setIsAdded] = useState(false);

  const canAdd = Boolean(result && summaryText && onAddToReport);

  const handleAdd = () => {
    if (!canAdd) return;

    onAddToReport({
      type,
      title,
      summaryText,
      tableRows,
      tableHeaders,
    });

    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <button
      type="button"
      disabled={!canAdd}
      onClick={handleAdd}
      className="w-full whitespace-nowrap rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {isAdded ? "Added" : "Add to Report"}
    </button>
  );
}

AddToReportButton.propTypes = {
  result: PropTypes.object,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summaryText: PropTypes.string,
  tableRows: PropTypes.arrayOf(PropTypes.object),
  tableHeaders: PropTypes.arrayOf(PropTypes.string),
  onAddToReport: PropTypes.func,
};
