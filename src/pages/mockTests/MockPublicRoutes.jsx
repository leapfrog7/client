import { Route, Routes } from "react-router-dom";

import MockTestsPage from "./MockTestsPage";
import MockTestStartPage from "./MockTestStartPage";
import MockAttemptPage from "./MockAttemptPage";
import MockResultLookupPage from "./MockResultLookupPage";
import MockResultsPage from "./MockResultsPage";
import MockLeaderboardPage from "./MockLeaderboardPage";

function MockPublicRoutes() {
  return (
    <Routes>
      <Route index element={<MockTestsPage />} />
      <Route path="results" element={<MockResultLookupPage />} />
      <Route path=":mockTestId/start" element={<MockTestStartPage />} />
      <Route path="attempt/:attemptId" element={<MockAttemptPage />} />
      <Route path="result/:attemptId" element={<MockResultsPage />} />
      <Route path=":mockTestId/leaderboard" element={<MockLeaderboardPage />} />
    </Routes>
  );
}

export default MockPublicRoutes;
