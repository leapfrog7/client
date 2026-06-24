import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import LoadingState from "../../../components/mocks/LoadingState";

import {
  createMockTest,
  getAdminMockTestById,
  updateMockTest,
} from "./mockAdminApi";

import { buildDefaultMockTestForm, formatDateForInput } from "./mockFormatters";

function MockTestFormPage() {
  const { mockTestId } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(mockTestId);

  const [form, setForm] = useState(() => buildDefaultMockTestForm());
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const pageTitle = isEditMode ? "Edit Mock Test" : "Create Mock Test";

  const isSubmitDisabled = useMemo(() => {
    return saving || loading;
  }, [saving, loading]);

  useEffect(() => {
    async function loadMockTest() {
      if (!isEditMode) return;

      try {
        setLoading(true);
        setError("");

        const response = await getAdminMockTestById(mockTestId);
        const mockTest = response?.data;

        if (!mockTest) {
          throw new Error("Mock test not found.");
        }

        setForm({
          title: mockTest.title || "",
          examName: mockTest.examName || "LDCE SO/PS conducted by UPSC",
          description: mockTest.description || "",
          instructions: mockTest.instructions || "",
          startAt: formatDateForInput(mockTest.startAt),
          endAt: formatDateForInput(mockTest.endAt),
          durationMinutes: Number(mockTest.durationMinutes || 30),
          totalQuestions: Number(mockTest.totalQuestions || 40),
          correctMarks: Number(mockTest.correctMarks ?? 1.25),
          negativeMarks: Number(mockTest.negativeMarks ?? 0.4166667),
          allowResume: Boolean(mockTest.allowResume),
          shuffleQuestions: Boolean(mockTest.shuffleQuestions),
          shuffleOptions: Boolean(mockTest.shuffleOptions),
          showScoreImmediately: Boolean(mockTest.showScoreImmediately),
          showLeaderboardAfterEnd: Boolean(mockTest.showLeaderboardAfterEnd),
        });
      } catch (err) {
        setError(err.message || "Failed to load mock test.");
      } finally {
        setLoading(false);
      }
    }

    loadMockTest();
  }, [isEditMode, mockTestId]);

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

  function validateForm() {
    const errors = {};

    if (!form.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!form.examName.trim()) {
      errors.examName = "Exam name is required.";
    }

    if (!form.startAt) {
      errors.startAt = "Start date/time is required.";
    }

    if (!form.endAt) {
      errors.endAt = "End date/time is required.";
    }

    if (form.startAt && form.endAt) {
      const startDate = new Date(form.startAt);
      const endDate = new Date(form.endAt);

      if (Number.isNaN(startDate.getTime())) {
        errors.startAt = "Start date/time is invalid.";
      }

      if (Number.isNaN(endDate.getTime())) {
        errors.endAt = "End date/time is invalid.";
      }

      if (!errors.startAt && !errors.endAt && endDate <= startDate) {
        errors.endAt = "End date/time must be after start date/time.";
      }
    }

    if (Number(form.durationMinutes) < 1) {
      errors.durationMinutes = "Duration must be at least 1 minute.";
    }

    if (Number(form.totalQuestions) < 1) {
      errors.totalQuestions = "Total questions must be at least 1.";
    }

    if (Number(form.correctMarks) <= 0) {
      errors.correctMarks = "Correct marks must be greater than 0.";
    }

    if (Number(form.negativeMarks) < 0) {
      errors.negativeMarks = "Negative marks cannot be negative.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function buildPayload() {
    return {
      title: form.title.trim(),
      examName: form.examName.trim(),
      description: form.description.trim(),
      instructions: form.instructions.trim(),
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      durationMinutes: Number(form.durationMinutes),
      totalQuestions: Number(form.totalQuestions),
      correctMarks: Number(form.correctMarks),
      negativeMarks: Number(form.negativeMarks),
      allowResume: Boolean(form.allowResume),
      shuffleQuestions: Boolean(form.shuffleQuestions),
      shuffleOptions: Boolean(form.shuffleOptions),
      showScoreImmediately: Boolean(form.showScoreImmediately),
      showLeaderboardAfterEnd: Boolean(form.showLeaderboardAfterEnd),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");

      const payload = buildPayload();

      if (isEditMode) {
        await updateMockTest(mockTestId, payload);
      } else {
        await createMockTest(payload);
      }

      navigate("/adminDashboard/mocks");
    } catch (err) {
      setError(err.message || "Failed to save mock test.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading mock test..." />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{pageTitle}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure the LDCE SO/PS mock test window, duration and scoring
              rules.
            </p>
          </div>

          <Link
            to="/adminDashboard/mocks"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <FaArrowLeft />
            Back
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border bg-white p-5 shadow-sm"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <TextField
            label="Mock Test Title"
            name="title"
            value={form.title}
            error={fieldErrors.title}
            placeholder="Mock Test 1"
            required
            onChange={updateField}
          />

          <TextField
            label="Exam Name"
            name="examName"
            value={form.examName}
            error={fieldErrors.examName}
            required
            onChange={updateField}
          />

          <DateTimeField
            label="Start Date/Time"
            name="startAt"
            value={form.startAt}
            error={fieldErrors.startAt}
            required
            onChange={updateField}
          />

          <DateTimeField
            label="End Date/Time"
            name="endAt"
            value={form.endAt}
            error={fieldErrors.endAt}
            required
            onChange={updateField}
          />

          <NumberField
            label="Duration Minutes"
            name="durationMinutes"
            value={form.durationMinutes}
            error={fieldErrors.durationMinutes}
            min={1}
            onChange={updateField}
          />

          <NumberField
            label="Total Questions"
            name="totalQuestions"
            value={form.totalQuestions}
            error={fieldErrors.totalQuestions}
            min={1}
            onChange={updateField}
          />

          <NumberField
            label="Correct Marks"
            name="correctMarks"
            value={form.correctMarks}
            error={fieldErrors.correctMarks}
            min={0}
            step="0.01"
            onChange={updateField}
          />

          <NumberField
            label="Negative Marks"
            name="negativeMarks"
            value={form.negativeMarks}
            error={fieldErrors.negativeMarks}
            min={0}
            step="0.0001"
            onChange={updateField}
          />

          <TextareaField
            label="Description"
            name="description"
            value={form.description}
            error={fieldErrors.description}
            rows={4}
            onChange={updateField}
          />

          <TextareaField
            label="Instructions"
            name="instructions"
            value={form.instructions}
            error={fieldErrors.instructions}
            rows={4}
            onChange={updateField}
          />
        </div>

        <div className="mt-6 rounded-lg border bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Behaviour Settings
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CheckboxField
              label="Allow save and resume"
              name="allowResume"
              checked={form.allowResume}
              onChange={updateField}
            />

            <CheckboxField
              label="Shuffle question order"
              name="shuffleQuestions"
              checked={form.shuffleQuestions}
              onChange={updateField}
            />

            <CheckboxField
              label="Shuffle options"
              name="shuffleOptions"
              checked={form.shuffleOptions}
              onChange={updateField}
              disabled
              helpText="Kept disabled as per current design."
            />

            <CheckboxField
              label="Show score immediately"
              name="showScoreImmediately"
              checked={form.showScoreImmediately}
              onChange={updateField}
            />

            <CheckboxField
              label="Show leaderboard after window closes"
              name="showLeaderboardAfterEnd"
              checked={form.showLeaderboardAfterEnd}
              onChange={updateField}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            to="/adminDashboard/mocks"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Mock Test"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldWrapper({ label, name, required = false, error, children }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-700"
      >
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>

      {children}

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function TextField({
  label,
  name,
  value,
  error,
  placeholder = "",
  required = false,
  onChange,
}) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error}>
      <input
        id={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </FieldWrapper>
  );
}

function DateTimeField({
  label,
  name,
  value,
  error,
  required = false,
  onChange,
}) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error}>
      <input
        id={name}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </FieldWrapper>
  );
}

function NumberField({
  label,
  name,
  value,
  error,
  min = 0,
  step = "1",
  onChange,
}) {
  return (
    <FieldWrapper label={label} name={name} error={error}>
      <input
        id={name}
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </FieldWrapper>
  );
}

function TextareaField({ label, name, value, error, rows = 3, onChange }) {
  return (
    <FieldWrapper label={label} name={name} error={error}>
      <textarea
        id={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </FieldWrapper>
  );
}

function CheckboxField({
  label,
  name,
  checked,
  disabled = false,
  helpText = "",
  onChange,
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border bg-white p-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(name, event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:cursor-not-allowed"
      />

      <span>
        <span className="font-semibold text-gray-800">{label}</span>
        {helpText ? (
          <span className="mt-1 block text-xs text-gray-500">{helpText}</span>
        ) : null}
      </span>
    </label>
  );
}

FieldWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

DateTimeField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

NumberField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  error: PropTypes.string,
  min: PropTypes.number,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

TextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  rows: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

CheckboxField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  helpText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default MockTestFormPage;
