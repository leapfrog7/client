import { useMemo, useState } from "react";

const createReportItemId = () => {
  return `report-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function useAnalysisReport() {
  const [reportItems, setReportItems] = useState([]);

  const addReportItem = ({
    type,
    title,
    summaryText = "",
    tableRows = [],
    tableHeaders = [],
  }) => {
    if (!type || !title) return;

    const newItem = {
      id: createReportItemId(),
      type,
      title,
      summaryText,
      tableRows,
      tableHeaders,
      createdAt: new Date().toISOString(),
    };

    setReportItems((prev) => [newItem, ...prev]);
  };

  const removeReportItem = (itemId) => {
    setReportItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearReport = () => {
    setReportItems([]);
  };

  const reportSummaryText = useMemo(() => {
    if (!reportItems.length) return "";

    return reportItems
      .map((item, index) => {
        return `${index + 1}. ${item.title}\n${item.summaryText}`;
      })
      .join("\n\n");
  }, [reportItems]);

  return {
    reportItems,
    reportItemCount: reportItems.length,
    hasReportItems: reportItems.length > 0,
    reportSummaryText,
    addReportItem,
    removeReportItem,
    clearReport,
  };
}
