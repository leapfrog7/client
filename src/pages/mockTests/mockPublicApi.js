import AxiosInstance from "../../components/PublicAxiosInstance";

const TEST_BASE = "/mocks/tests";
const ATTEMPT_BASE = "/mocks/attempts";

function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export async function getPublicMockTests() {
  try {
    const response = await AxiosInstance.get(TEST_BASE);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch mock tests."));
  }
}

export async function getPublicMockTestById(mockTestId) {
  try {
    const response = await AxiosInstance.get(`${TEST_BASE}/${mockTestId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch mock test."));
  }
}

export async function startOrResumeAttempt(mockTestId, payload) {
  try {
    const response = await AxiosInstance.post(
      `${ATTEMPT_BASE}/${mockTestId}/start`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to start or resume test."));
  }
}

export async function resumeAttemptById(attemptId, payload) {
  try {
    const response = await AxiosInstance.post(
      `${ATTEMPT_BASE}/${attemptId}/resume`,
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to recover attempt."));
  }
}

export async function saveAttemptAnswers(attemptId, answers) {
  try {
    const response = await AxiosInstance.patch(
      `${ATTEMPT_BASE}/${attemptId}/save`,
      { answers },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to save answers."));
  }
}

export async function pauseAttempt(attemptId, answers) {
  try {
    const response = await AxiosInstance.patch(
      `${ATTEMPT_BASE}/${attemptId}/pause`,
      { answers },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to save and pause test."));
  }
}

export async function submitAttempt(attemptId, answers) {
  try {
    const response = await AxiosInstance.post(
      `${ATTEMPT_BASE}/${attemptId}/submit`,
      { answers },
    );

    return response.data;
  } catch (error) {
    const responseData = error?.response?.data;

    if (
      error?.response?.status === 400 &&
      responseData?.message === "Attempt is already finalized." &&
      ["submitted", "auto_submitted", "expired"].includes(
        responseData?.data?.status,
      )
    ) {
      return {
        success: true,
        message: responseData.message,
        data: responseData.data,
        alreadyFinalized: true,
      };
    }

    throw new Error(getErrorMessage(error, "Failed to submit test."));
  }
}

export async function lookupResults(payload) {
  try {
    const response = await AxiosInstance.post(
      `${ATTEMPT_BASE}/results/lookup`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to lookup results."));
  }
}

export async function getAttemptResult(attemptId, payload) {
  try {
    const response = await AxiosInstance.post(
      `${ATTEMPT_BASE}/${attemptId}/result`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch result."));
  }
}

export async function getLeaderboard(mockTestId) {
  try {
    const response = await AxiosInstance.get(
      `${ATTEMPT_BASE}/${mockTestId}/leaderboard`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch leaderboard."));
  }
}
