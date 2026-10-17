import { formatMockDateForInput, formatMockDateTime } from "../../../util/mockSchedule";

export const formatDateTime = formatMockDateTime;
export const formatDateForInput = formatMockDateForInput;

export function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toFixed(2);
}

export function formatAccuracy(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${Number(value).toFixed(2)}%`;
}

export function getComputedStatusLabel(status) {
  const labels = {
    draft: "Draft",
    upcoming: "Upcoming",
    active: "Active",
    closed: "Closed",
    archived: "Archived",
  };

  return labels[status] || status || "-";
}

export function getStoredStatusLabel(status) {
  const labels = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  };

  return labels[status] || status || "-";
}

export function getAttemptStatusLabel(status) {
  const labels = {
    in_progress: "In Progress",
    paused: "Paused",
    submitted: "Submitted",
    auto_submitted: "Auto-submitted",
    expired: "Expired",
    disqualified: "Disqualified",
  };

  return labels[status] || status || "-";
}

export function getStatusClasses(status) {
  const classes = {
    draft: "bg-gray-100 text-gray-700 border-gray-200",
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    active: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-amber-50 text-amber-700 border-amber-200",
    archived: "bg-red-50 text-red-700 border-red-200",
    published: "bg-teal-50 text-teal-700 border-teal-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    paused: "bg-yellow-50 text-yellow-700 border-yellow-200",
    submitted: "bg-green-50 text-green-700 border-green-200",
    auto_submitted: "bg-purple-50 text-purple-700 border-purple-200",
    expired: "bg-red-50 text-red-700 border-red-200",
    disqualified: "bg-red-100 text-red-800 border-red-300",
  };

  return classes[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

export function normalizeQuestionOptions(options) {
  if (!Array.isArray(options)) {
    return [
      { optionText: "" },
      { optionText: "" },
      { optionText: "" },
      { optionText: "" },
    ];
  }

  const cleaned = options.map((option) => ({
    optionText: option?.optionText || "",
  }));

  while (cleaned.length < 4) {
    cleaned.push({ optionText: "" });
  }

  return cleaned;
}

export function buildDefaultMockTestForm() {
  const now = new Date();
  const startAt = new Date(now.getTime() + 60 * 60 * 1000);
  const endAt = new Date(startAt.getTime() + 36 * 60 * 60 * 1000);

  return {
    title: "",
    examName: "LDCE SO/PS conducted by UPSC",
    description: "",
    instructions:
      "This mock test contains 40 questions. The duration is 30 minutes. Each correct answer carries 1.25 marks and each wrong answer attracts one-third negative marking. You may save and resume within the mock test window. The score will be available immediately after submission. The leaderboard will be available after the mock test window closes.",
    startAt: formatDateForInput(startAt),
    endAt: formatDateForInput(endAt),
    durationMinutes: 30,
    totalQuestions: 40,
    correctMarks: 1.25,
    negativeMarks: 0.4166667,
    allowResume: true,
    shuffleQuestions: true,
    shuffleOptions: false,
    showScoreImmediately: true,
    showLeaderboardAfterEnd: true,
  };
}

export function buildDefaultQuestionForm() {
  return {
    questionText: "",
    options: [
      { optionText: "" },
      { optionText: "" },
      { optionText: "" },
      { optionText: "" },
    ],
    correctOptionIndex: 0,
    explanation: "",
    topic: "",
    subject: "",
    difficulty: "",
    orderNo: 0,
    isActive: true,
  };
}
