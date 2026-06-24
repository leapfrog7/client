import { Routes, Route } from "react-router-dom";

import AdminMockTestPage from "./AdminMockTestPage";
import MockTestFormPage from "./MockTestFormPage";
import MockQuestionsPage from "./MockQuestionsPage";
import MockQuestionFormPage from "./MockQuestionFormPage";
import MockAttemptsPage from "./MockAttemptsPage";
import MockAttemptDetailPage from "./MockAttemptDetailPage";

function AdminMockRoutes() {
  return (
    <Routes>
      <Route index element={<AdminMockTestPage />} />

      <Route path="new" element={<MockTestFormPage />} />

      <Route path=":mockTestId/edit" element={<MockTestFormPage />} />

      <Route path=":mockTestId/questions" element={<MockQuestionsPage />} />

      <Route
        path=":mockTestId/questions/new"
        element={<MockQuestionFormPage />}
      />

      <Route
        path=":mockTestId/questions/:questionId/edit"
        element={<MockQuestionFormPage />}
      />

      <Route path=":mockTestId/attempts" element={<MockAttemptsPage />} />

      <Route
        path=":mockTestId/attempts/:attemptId"
        element={<MockAttemptDetailPage />}
      />
    </Routes>
  );
}

export default AdminMockRoutes;
