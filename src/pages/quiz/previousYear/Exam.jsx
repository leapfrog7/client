import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Results from "./Results";
import axiosInstance from "../../../components/AxiosInstance";
import { getUserIdFromToken } from "../../../util/decodeJWT";

import useExamPapers from "./hooks/useExamPapers";
import useExamSession from "./hooks/useExamSession";
import useExamTimer from "./hooks/useExamTimer";

import PaperListTable from "./components/PaperListTable";
import ActiveExamLayout from "./components/ActiveExamLayout";
import SaveToast from "./components/SaveToast";
import SubmittingOverlay from "./components/SubmittingOverlay";

const Exam = () => {
  const yearsToShow = ["2016-17", "2018", "2019-20", "2021-22", "2023", "2024"];
  const navigate = useNavigate();
  const [viewedResult, setViewedResult] = useState(null);

  const { setPapers, filteredPapers, fetchPapers } = useExamPapers(yearsToShow);

  const session = useExamSession({
    setPapers,
    fetchPapers,
    resetTimeUpGuard: null,
  });

  const { resetTimeUpGuard } = useExamTimer({
    isStarted: session.isStarted,
    remainingTime: session.remainingTime,
    setRemainingTime: session.setRemainingTime,
    onTimeUp: session.handleSaveAndSubmit,
  });

  const handleViewResult = useCallback(async (paper) => {
    try {
      const userId = getUserIdFromToken();

      const { data } = await axiosInstance.get(
        `/prevYearQuiz/latest-result/${userId}/${paper._id}`,
      );

      setViewedResult({
        paper,
        questions: data.paper?.questions || [],
        evaluatedResponses: data.result?.evaluatedResponses || [],
        score: data.result?.score || 0,
        remainingTime: data.result?.remainingTime ?? 0,
      });
    } catch (error) {
      console.error("Error fetching latest result:", error);
    }
  }, []);

  const goHome = useCallback(async () => {
    try {
      await fetchPapers?.();
    } catch (e) {
      console.warn("Refresh papers failed:", e);
    }

    resetTimeUpGuard?.();
    session.hardResetLocalState();
    setViewedResult(null);
    navigate("/pages/quiz/previousYear/Exam", { replace: true });
  }, [fetchPapers, navigate, resetTimeUpGuard, session]);

  if (session.isSubmitting) {
    return (
      <div className="p-4 md:p-8">
        <SubmittingOverlay />
      </div>
    );
  }

  return (
    <div className="px-1 py-2 md:p-8">
      {!session.isStarted && !session.isSubmitted && !viewedResult && (
        <PaperListTable
          filteredPapers={filteredPapers}
          onStart={(paper) => {
            resetTimeUpGuard?.();
            setViewedResult(null);
            session.handleStart(paper.year, paper.paperType, false);
          }}
          onResume={(paper) => {
            resetTimeUpGuard?.();
            setViewedResult(null);
            session.handleStart(paper.year, paper.paperType, true);
          }}
          onResetTimer={session.resetTimer}
          onViewResult={handleViewResult}
        />
      )}

      {session.isStarted && !session.isSubmitted && session.currentPaper && (
        <ActiveExamLayout
          paperId={session.paperId}
          currentPaper={session.currentPaper}
          remainingTime={session.remainingTime}
          onTimeUp={session.handleSaveAndSubmit}
          questions={session.questions}
          answers={session.answers}
          showCorrectAnswer={session.showCorrectAnswer}
          onToggleShowCorrectAnswer={() =>
            session.setShowCorrectAnswer((prev) => !prev)
          }
          onSelectOption={session.handleOptionSelect}
          onPreviousQuestion={session.handlePreviousQuestion}
          onNextQuestion={session.handleNextQuestion}
          onSave={session.handleSave}
          onSubmit={session.handleSubmitQuiz}
          onQuestionSelect={session.handleQuestionSelect}
        />
      )}

      {viewedResult && (
        <Results
          questions={viewedResult.questions}
          evaluatedResponses={viewedResult.evaluatedResponses}
          score={viewedResult.score}
          remainingTime={viewedResult.remainingTime}
          onGoHome={goHome}
          onRetake={() => {
            setViewedResult(null);
            resetTimeUpGuard?.();
            session.handleStart(
              viewedResult.paper.year,
              viewedResult.paper.paperType,
              false,
            );
          }}
        />
      )}

      {session.isSubmitted && (
        <Results
          questions={session.questions}
          evaluatedResponses={session.evaluatedResponses}
          score={session.score}
          remainingTime={session.remainingTime}
          onGoHome={goHome}
          onRetake={() => session.resetTimer(session.paperId)}
        />
      )}

      <SaveToast isSaved={session.isSaved} />
    </div>
  );
};

export default Exam;
