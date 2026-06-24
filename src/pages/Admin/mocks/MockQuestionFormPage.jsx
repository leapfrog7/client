import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaSave, FaTrash } from "react-icons/fa";

import LoadingState from "../../../components/mocks/LoadingState";
import QuestionPreviewCard from "../../../components/mocks/QuestionPreviewCard";

import {
  createQuestion,
  getQuestionById,
  updateQuestion,
} from "./mockAdminApi";

import {
  buildDefaultQuestionForm,
  normalizeQuestionOptions,
} from "./mockFormatters";

function MockQuestionFormPage() {
  const { mockTestId, questionId } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(questionId);

  const [form, setForm] = useState(() => buildDefaultQuestionForm());
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    async function loadQuestion() {
      if (!isEditMode) return;

      try {
        setLoading(true);
        setError("");

        const response = await getQuestionById(questionId);
        const question = response?.data;

        if (!question) {
          throw new Error("Question not found.");
        }

        setForm({
          questionText: question.questionText || "",
          options: normalizeQuestionOptions(question.options),
          correctOptionIndex: Number(question.correctOptionIndex || 0),
          explanation: question.explanation || "",
          topic: question.topic || "",
          subject: question.subject || "",
          difficulty: question.difficulty || "",
          orderNo: Number(question.orderNo || 0),
          isActive: Boolean(question.isActive),
        });
      } catch (err) {
        setError(err.message || "Failed to load question.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestion();
  }, [isEditMode, questionId]);

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

  function updateOption(index, value) {
    setForm((prev) => {
      const nextOptions = [...prev.options];
      nextOptions[index] = {
        ...nextOptions[index],
        optionText: value,
      };

      return {
        ...prev,
        options: nextOptions,
      };
    });

    setFieldErrors((prev) => ({
      ...prev,
      options: "",
    }));
  }

  function addOption() {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { optionText: "" }],
    }));
  }

  function removeOption(index) {
    setForm((prev) => {
      if (prev.options.length <= 2) return prev;

      const nextOptions = prev.options.filter(
        (_, itemIndex) => itemIndex !== index,
      );
      const nextCorrectIndex =
        prev.correctOptionIndex >= nextOptions.length
          ? 0
          : prev.correctOptionIndex;

      return {
        ...prev,
        options: nextOptions,
        correctOptionIndex: nextCorrectIndex,
      };
    });
  }

  function validateForm() {
    const errors = {};

    if (!form.questionText.trim()) {
      errors.questionText = "Question text is required.";
    }

    const cleanedOptions = form.options.map((option) => ({
      optionText: String(option.optionText || "").trim(),
    }));

    if (cleanedOptions.length < 2) {
      errors.options = "At least two options are required.";
    }

    if (cleanedOptions.some((option) => !option.optionText)) {
      errors.options = "All options must contain text.";
    }

    if (
      Number(form.correctOptionIndex) < 0 ||
      Number(form.correctOptionIndex) >= cleanedOptions.length
    ) {
      errors.correctOptionIndex = "Correct option is invalid.";
    }

    if (Number(form.orderNo) < 0) {
      errors.orderNo = "Order number cannot be negative.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function buildPayload() {
    return {
      questionText: form.questionText.trim(),
      options: form.options.map((option) => ({
        optionText: String(option.optionText || "").trim(),
      })),
      correctOptionIndex: Number(form.correctOptionIndex),
      explanation: form.explanation.trim(),
      topic: form.topic.trim(),
      subject: form.subject.trim(),
      difficulty: form.difficulty,
      orderNo: Number(form.orderNo || 0),
      isActive: Boolean(form.isActive),
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
        await updateQuestion(questionId, payload);
      } else {
        await createQuestion(mockTestId, payload);
      }

      navigate(`/adminDashboard/mocks/${mockTestId}/questions`);
    } catch (err) {
      setError(err.message || "Failed to save question.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading question..." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Question" : "Add Question"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add question text, options, correct answer and explanation.
          </p>
        </div>

        <Link
          to={`/adminDashboard/mocks/${mockTestId}/questions`}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft />
          Back to Questions
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border bg-white p-5 shadow-sm"
        >
          <TextareaField
            label="Question Text"
            name="questionText"
            value={form.questionText}
            error={fieldErrors.questionText}
            required
            rows={5}
            onChange={updateField}
          />

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Options <span className="text-red-600">*</span>
              </label>

              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center gap-1 rounded border border-teal-200 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
              >
                <FaPlus />
                Add Option
              </button>
            </div>

            <div className="space-y-3">
              {form.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <label className="flex w-full items-center gap-2 rounded-md border border-gray-300 px-3 py-2">
                    <input
                      type="radio"
                      name="correctOptionIndex"
                      checked={Number(form.correctOptionIndex) === index}
                      onChange={() => updateField("correctOptionIndex", index)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />

                    <span className="w-6 text-sm font-semibold text-gray-600">
                      {String.fromCharCode(65 + index)}.
                    </span>

                    <input
                      type="text"
                      value={option.optionText}
                      onChange={(event) =>
                        updateOption(index, event.target.value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="w-full border-0 text-sm focus:outline-none focus:ring-0"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={form.options.length <= 2}
                    className="rounded-md border border-red-200 px-3 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove option"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {fieldErrors.options ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {fieldErrors.options}
              </p>
            ) : null}

            {fieldErrors.correctOptionIndex ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {fieldErrors.correctOptionIndex}
              </p>
            ) : null}

            <p className="mt-2 text-xs text-gray-500">
              Select the radio button beside the correct option.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextField
              label="Subject"
              name="subject"
              value={form.subject}
              error={fieldErrors.subject}
              onChange={updateField}
            />

            <TextField
              label="Topic"
              name="topic"
              value={form.topic}
              error={fieldErrors.topic}
              onChange={updateField}
            />

            <SelectField
              label="Difficulty"
              name="difficulty"
              value={form.difficulty}
              error={fieldErrors.difficulty}
              onChange={updateField}
              options={[
                { value: "", label: "Not specified" },
                { value: "easy", label: "Easy" },
                { value: "moderate", label: "Moderate" },
                { value: "difficult", label: "Difficult" },
              ]}
            />

            <NumberField
              label="Order Number"
              name="orderNo"
              value={form.orderNo}
              error={fieldErrors.orderNo}
              min={0}
              onChange={updateField}
            />
          </div>

          <div className="mt-5">
            <TextareaField
              label="Explanation"
              name="explanation"
              value={form.explanation}
              error={fieldErrors.explanation}
              rows={5}
              onChange={updateField}
            />
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-md border bg-gray-50 p-3 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="font-semibold text-gray-800">
              Question is active
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              to={`/adminDashboard/mocks/${mockTestId}/questions`}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSave />
              {saving ? "Saving..." : "Save Question"}
            </button>
          </div>
        </form>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <QuestionPreviewCard question={buildPayloadSafe(form)} showAnswer />
        </div>
      </div>
    </div>
  );
}

function buildPayloadSafe(form) {
  return {
    questionText: form.questionText,
    options: form.options,
    correctOptionIndex: Number(form.correctOptionIndex || 0),
    explanation: form.explanation,
    topic: form.topic,
    subject: form.subject,
    difficulty: form.difficulty,
    isActive: form.isActive,
  };
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

function TextField({ label, name, value, error, required = false, onChange }) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error}>
      <input
        id={name}
        type="text"
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </FieldWrapper>
  );
}

function NumberField({ label, name, value, error, min = 0, onChange }) {
  return (
    <FieldWrapper label={label} name={name} error={error}>
      <input
        id={name}
        type="number"
        min={min}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </FieldWrapper>
  );
}

function TextareaField({
  label,
  name,
  value,
  error,
  rows = 3,
  required = false,
  onChange,
}) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error}>
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

function SelectField({ label, name, value, error, options, onChange }) {
  return (
    <FieldWrapper label={label} name={name} error={error}>
      <select
        id={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        {options.map((option) => (
          <option key={option.value || "blank"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
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
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

NumberField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  error: PropTypes.string,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

TextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MockQuestionFormPage;
