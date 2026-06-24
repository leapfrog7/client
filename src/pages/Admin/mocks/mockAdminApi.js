import AxiosInstance from "../../../components/AxiosInstance";

const ADMIN_BASE = "/mocks/admin";
const QUESTION_BASE = "/mocks/questions";

function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export async function getAdminMockTests() {
  try {
    const response = await AxiosInstance.get(`${ADMIN_BASE}/tests`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch mock tests."));
  }
}

export async function getAdminMockTestById(mockTestId) {
  try {
    const response = await AxiosInstance.get(
      `${ADMIN_BASE}/tests/${mockTestId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch mock test."));
  }
}

export async function createMockTest(payload) {
  try {
    const response = await AxiosInstance.post(`${ADMIN_BASE}/tests`, payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create mock test."));
  }
}

export async function updateMockTest(mockTestId, payload) {
  try {
    const response = await AxiosInstance.put(
      `${ADMIN_BASE}/tests/${mockTestId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update mock test."));
  }
}

export async function publishMockTest(mockTestId) {
  try {
    const response = await AxiosInstance.patch(
      `${ADMIN_BASE}/tests/${mockTestId}/publish`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to publish mock test."));
  }
}

export async function archiveMockTest(mockTestId) {
  try {
    const response = await AxiosInstance.patch(
      `${ADMIN_BASE}/tests/${mockTestId}/archive`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to archive mock test."));
  }
}

export async function getQuestionsByMockTest(mockTestId) {
  try {
    const response = await AxiosInstance.get(
      `${QUESTION_BASE}/admin/${mockTestId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch questions."));
  }
}

export async function getQuestionById(questionId) {
  try {
    const response = await AxiosInstance.get(
      `${QUESTION_BASE}/admin/question/${questionId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch question."));
  }
}

export async function createQuestion(mockTestId, payload) {
  try {
    const response = await AxiosInstance.post(
      `${QUESTION_BASE}/admin/${mockTestId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create question."));
  }
}

export async function updateQuestion(questionId, payload) {
  try {
    const response = await AxiosInstance.put(
      `${QUESTION_BASE}/admin/question/${questionId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update question."));
  }
}

export async function deleteQuestion(questionId) {
  try {
    const response = await AxiosInstance.delete(
      `${QUESTION_BASE}/admin/question/${questionId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete question."));
  }
}

export async function toggleQuestionActive(questionId) {
  try {
    const response = await AxiosInstance.patch(
      `${QUESTION_BASE}/admin/question/${questionId}/toggle-active`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to update question status."),
    );
  }
}

export async function reorderQuestions(mockTestId, items) {
  try {
    const response = await AxiosInstance.patch(
      `${QUESTION_BASE}/admin/${mockTestId}/reorder`,
      { items },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to reorder questions."));
  }
}

export async function getMockAttemptSummary(mockTestId) {
  try {
    const response = await AxiosInstance.get(
      `${ADMIN_BASE}/attempts/${mockTestId}/summary`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch attempt summary."));
  }
}

export async function getMockAttempts(mockTestId, status = "") {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const response = await AxiosInstance.get(
      `${ADMIN_BASE}/attempts/${mockTestId}${query}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch attempts."));
  }
}

export async function getMockAttemptDetail(attemptId) {
  try {
    const response = await AxiosInstance.get(
      `${ADMIN_BASE}/attempts/detail/${attemptId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch attempt detail."));
  }
}

export async function disqualifyAttempt(attemptId, reason) {
  try {
    const response = await AxiosInstance.patch(
      `${ADMIN_BASE}/attempts/${attemptId}/disqualify`,
      { reason },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to disqualify attempt."));
  }
}

export async function restoreAttempt(attemptId) {
  try {
    const response = await AxiosInstance.patch(
      `${ADMIN_BASE}/attempts/${attemptId}/restore`,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to restore attempt."));
  }
}
