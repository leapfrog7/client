import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import { normalizeStartAttemptResponse } from "./mockPublicMappers";

import LoadingState from "../../components/mocks/LoadingState";
import MockInfoCard from "../../components/mocks/MockInfoCard";

import { getPublicMockTestById, startOrResumeAttempt } from "./mockPublicApi";
import { getStoredRegisteredIdentity } from "./mockUserIdentity";

function MockTestStartPage() {
  const { mockTestId } = useParams();
  const navigate = useNavigate();

  const [mockTest, setMockTest] = useState(null);
  const [form, setForm] = useState({
    username: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [registeredIdentity, setRegisteredIdentity] = useState({
    isLoggedIn: false,
    username: "",
    mobile: "",
  });

  const canStart = useMemo(() => {
    return mockTest?.computedStatus === "active";
  }, [mockTest]);

  async function loadMockTest() {
    try {
      setLoading(true);
      setError("");

      const response = await getPublicMockTestById(mockTestId);
      setMockTest(response?.data || null);
    } catch (err) {
      setError(err.message || "Failed to load mock test.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMockTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  useEffect(() => {
    const identity = getStoredRegisteredIdentity();

    if (!identity.isLoggedIn) return;

    setRegisteredIdentity(identity);

    setForm((prev) => ({
      ...prev,
      username: prev.username || identity.username || "",
      mobile: prev.mobile || identity.mobile || "",
    }));
  }, []);

  function updateField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handleStart(event) {
    event.preventDefault();

    const cleanedForm = {
      username: sanitizeUsername(form.username).trim(),
      mobile: sanitizeMobile(form.mobile),
    };

    const errors = validateStartForm(cleanedForm);

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    try {
      setStarting(true);
      setError("");
      setFieldErrors({});

      const response = await startOrResumeAttempt(mockTestId, cleanedForm);

      const { attemptId, attempt, questions } =
        normalizeStartAttemptResponse(response);

      if (!attemptId) {
        throw new Error("Attempt could not be started.");
      }

      if (
        ["submitted", "auto_submitted", "expired"].includes(attempt?.status)
      ) {
        navigate(`/mock-tests/result/${attemptId}`, {
          state: {
            username: cleanedForm.username,
            mobile: cleanedForm.mobile,
          },
        });
        return;
      }

      navigate(`/mock-tests/attempt/${attemptId}`, {
        state: {
          username: cleanedForm.username,
          mobile: cleanedForm.mobile,
          attempt,
          questions,
          mockTest,
        },
      });
    } catch (err) {
      setError(err.message || "Failed to start test.");
    } finally {
      setStarting(false);
    }
  }
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <LoadingState message="Loading mock test..." />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/mock-tests"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FaArrowLeft />
            Back to Mock Tests
          </Link>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 shadow-sm">
            LDCE SO/PS Mock Test
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-5 text-white sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
              Start / Resume Attempt
            </p>

            <h1 className="mt-2 text-xl font-black leading-tight sm:text-2xl">
              {mockTest?.title || "Mock Test"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              Enter your name and mobile number to start the mock test. Use the
              same details later to resume your attempt or view your result.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-5 border-b border-slate-100 p-4 sm:p-6 lg:border-b-0 lg:border-r">
              <MockInfoCard mockTest={mockTest} />

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
                  {error}
                </div>
              ) : null}

              {!canStart ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
                  <p className="font-bold">
                    Mock test is not active at present.
                  </p>
                  <p className="mt-1">
                    You can start the test only during the notified test window.
                    Please check the start and end time shown above.
                  </p>
                </div>
              ) : null}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                        Before you begin
                      </p>
                      <h2 className="mt-1 text-base font-black text-slate-950 sm:text-lg">
                        Test Instructions
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Please review the rules carefully. Your attempt will be
                        linked to the name and mobile number entered on this
                        page.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <InstructionStat
                      label="Questions"
                      value={mockTest?.totalQuestions || 40}
                    />
                    <InstructionStat
                      label="Duration"
                      value={`${mockTest?.durationMinutes || 30} min`}
                    />
                    <InstructionStat label="Negative Marking" value="Yes" />
                  </div>

                  {mockTest?.instructions ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Special instructions for this mock test
                      </p>
                      <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {mockTest.instructions}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      <InstructionPoint title="Time limit">
                        The test contains{" "}
                        <strong>
                          {mockTest?.totalQuestions || 40} questions
                        </strong>{" "}
                        and must be completed within{" "}
                        <strong>
                          {mockTest?.durationMinutes || 30} minutes
                        </strong>
                        .
                      </InstructionPoint>

                      <InstructionPoint title="Marking scheme">
                        Each correct answer carries{" "}
                        <strong>{mockTest?.correctMarks ?? 1.25} marks</strong>.
                        Each wrong answer attracts negative marking of{" "}
                        <strong>
                          {mockTest?.negativeMarks ?? 0.4166667} marks
                        </strong>
                        . Unattempted questions carry zero marks.
                      </InstructionPoint>

                      <InstructionPoint title="Save and resume">
                        You may save and resume the test within the notified
                        mock test window, provided the attempt has not already
                        been submitted or expired.
                      </InstructionPoint>

                      <InstructionPoint title="Submission">
                        Once submitted, the attempt cannot be changed. If the
                        duration is consumed or the test window closes, the
                        attempt may be auto-submitted.
                      </InstructionPoint>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
                    <p className="font-black">Important</p>
                    <p className="mt-1">
                      Avoid refreshing or closing the live test page during the
                      attempt. Use the Save or Pause option available inside the
                      test interface.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="bg-white p-4 sm:p-6">
              <form
                onSubmit={handleStart}
                className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Candidate Details
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Enter the same name and mobile number to resume an existing
                    attempt.
                  </p>
                </div>

                {registeredIdentity.isLoggedIn ? (
                  <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-3 py-3 text-xs leading-5 text-teal-900">
                    <p className="font-bold">Registered details detected.</p>
                    <p className="mt-1">
                      Your registered name and mobile number have been
                      pre-filled. Just Click on Start.
                    </p>
                  </div>
                ) : null}

                <div className="mt-5 space-y-4">
                  <TextField
                    label="Name"
                    name="username"
                    value={form.username}
                    error={fieldErrors.username}
                    placeholder="Enter name / roll name"
                    maxLength={16}
                    autoComplete="name"
                    helperText="Maximum 16 characters. Letters, numbers and spaces only."
                    onChange={(name, value) =>
                      updateField(name, sanitizeUsername(value))
                    }
                  />

                  <TextField
                    label="Mobile Number"
                    name="mobile"
                    value={form.mobile}
                    error={fieldErrors.mobile}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    helperText="Enter a valid 10-digit Indian mobile number."
                    onChange={(name, value) =>
                      updateField(name, sanitizeMobile(value))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canStart || starting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaPlay />
                  {starting ? "Starting..." : "Start / Resume Test"}
                </button>

                <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-600">
                  <p>
                    Your attempt is linked to your name and mobile number.
                    Please enter them carefully.
                  </p>
                </div>
              </form>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function TextField({
  label,
  name,
  value,
  error,
  placeholder = "",
  inputMode = "text",
  maxLength,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        type="text"
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  inputMode: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

function InstructionPoint({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex gap-3">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-700" />
        <div>
          <p className="text-sm font-black text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{children}</p>
        </div>
      </div>
    </div>
  );
}

InstructionPoint.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function InstructionStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

InstructionStat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function sanitizeUsername(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 16);
}

function sanitizeMobile(value) {
  return String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

function validateStartForm(form) {
  const errors = {};

  const username = String(form.username || "").trim();
  const mobile = String(form.mobile || "").trim();

  if (!username) {
    errors.username = "Name is required.";
  } else if (username.length < 2) {
    errors.username = "Name must be at least 2 characters.";
  } else if (username.length > 16) {
    errors.username = "Name cannot exceed 16 characters.";
  } else if (!/^[a-zA-Z0-9 ]+$/.test(username)) {
    errors.username = "Name can contain only letters, numbers and spaces.";
  }

  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  }

  return errors;
}

export default MockTestStartPage;
