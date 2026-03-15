import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../../components/AxiosInstance";
import { getUserIdFromToken } from "../../../../util/decodeJWT";

export default function useExamPapers(yearsToShow) {
  const [papers, setPapers] = useState([]);

  const fetchPapers = useCallback(async () => {
    try {
      const userId = getUserIdFromToken();
      const response = await axiosInstance.get(
        "/prevYearQuiz/available-papers",
        {
          params: { userId },
        },
      );
      setPapers(response.data || []);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => yearsToShow.includes(paper.year));
  }, [papers, yearsToShow]);

  return {
    papers,
    setPapers,
    filteredPapers,
    fetchPapers,
  };
}
