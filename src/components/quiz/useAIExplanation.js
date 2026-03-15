import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, TOKEN } from "./quizUtils";

export default function useAIExplanation() {
  const [aiModal, setAiModal] = useState({
    open: false,
    title: "",
    content: "",
    loading: false,
    error: "",
  });

  const retryTimerRef = useRef(null);

  const clearRetry = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const closeAiModal = useCallback(() => {
    clearRetry();
    setAiModal((prev) => ({ ...prev, open: false }));
  }, []);

  const fetchAIExplanation = useCallback(async (questionId) => {
    clearRetry();

    setAiModal({
      open: true,
      title: "Generating explanation...",
      content: "",
      loading: true,
      error: "",
    });

    const poll = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/ai/question/${questionId}`,
          {
            headers: { Authorization: `Bearer ${TOKEN()}` },
          },
        );

        if (data?.source === "pending") {
          retryTimerRef.current = setTimeout(poll, 1200);
          return;
        }

        setAiModal({
          open: true,
          title: "AI Explanation (verify with sources)",
          content: data?.text || "",
          loading: false,
          error: "",
        });
      } catch (e) {
        setAiModal({
          open: true,
          title: "AI Explanation",
          content: "",
          loading: false,
          error: "Could not load AI explanation.",
        });
      }
    };

    await poll();
  }, []);

  return {
    aiModal,
    setAiModal,
    closeAiModal,
    fetchAIExplanation,
  };
}
