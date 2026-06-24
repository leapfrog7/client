import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

import EmptyMockState from "../../components/mocks/EmptyMockState";
import LoadingState from "../../components/mocks/LoadingState";
import AttemptStatusBadge from "../../components/mocks/AttemptStatusBadge";

import { lookupResults } from "./mockPublicApi";

import { formatDateTime, formatScore } from "../Admin/mocks/mockFormatters";

function MockResultLookupPage() {
  const [form, setForm] = useState({
    username: "",
    mobile: "",
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

    if (!form.username.trim()) {
      errors.username = "Name is required.";
    }

    if (!form.mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleLookup(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response = await lookupResults({
        username: form.username.trim(),
        mobile: form.mobile.trim(),
      });

      setResults(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Failed to lookup results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <Link
          to="/mock-tests"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft />
          Back to Mock Tests
        </Link>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Mock Test Results
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Find your submitted attempts
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Enter the same name and mobile number used while starting the mock
            test. Results are shown only for matching participant details.
          </p>
        </section>

        <form
          onSubmit={handleLookup}
          className="rounded-lg border bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start">
            <TextField
              label="Name"
              name="username"
              value={form.username}
              error={fieldErrors.username}
              placeholder="Enter your name"
              onChange={updateField}
            />

            <TextField
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              error={fieldErrors.mobile}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              onChange={(name, value) =>
                updateField(name, value.replace(/\D/g, "").slice(0, 10))
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 md:mt-6"
            >
              <FaSearch />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? <LoadingState message="Searching results..." /> : null}

        {!loading && searched && !results.length ? (
          <EmptyMockState
            title="No result found"
            message="No submitted attempt was found for the provided name and mobile number."
          />
        ) : null}

        {!loading && results.length ? (
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Mock Test</Th>
                    <Th>Status</Th>
                    <Th>Score</Th>
                    <Th>Submitted</Th>
                    <Th align="right">Action</Th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {results.map((result) => (
                    <tr key={result.attemptId} className="hover:bg-gray-50">
                      <Td>
                        <p className="font-semibold text-gray-900">
                          {result.mockTestTitle || "Mock Test"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {result.examName || "LDCE SO/PS conducted by UPSC"}
                        </p>
                      </Td>

                      <Td>
                        <AttemptStatusBadge status={result.status} />
                      </Td>

                      <Td>
                        <p className="font-bold text-gray-900">
                          {formatScore(result.score)}
                        </p>
                      </Td>

                      <Td>{formatDateTime(result.submittedAt)}</Td>

                      <Td align="right">
                        <Link
                          to={`/mock-tests/result/${result.attemptId}`}
                          state={{
                            username: form.username.trim(),
                            mobile: form.mobile.trim(),
                          }}
                          className="inline-flex items-center rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                        >
                          View Result
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
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

function Th({ children, align = "left" }) {
  return (
    <th
      className={[
        "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      className={[
        "whitespace-nowrap px-4 py-3 align-top",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </td>
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

Th.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

Td.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

export default MockResultLookupPage;
