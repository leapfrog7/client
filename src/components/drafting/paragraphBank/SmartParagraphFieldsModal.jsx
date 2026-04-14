import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { parseParagraphVariables } from "../features/utils/parseParagraphVariables";
import { fillParagraphTemplate } from "../features/utils/fillParagraphTemplate";

SmartParagraphFieldsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
};

function prettifyKey(key) {
  return String(key || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SmartParagraphFieldsModal({
  open,
  onClose,
  item,
  onSubmit,
}) {
  const variables = useMemo(
    () => parseParagraphVariables(item?.content || ""),
    [item?.content],
  );

  const [values, setValues] = useState({});

  useEffect(() => {
    if (!open) {
      setValues({});
    }
  }, [open]);

  if (!open || !item) return null;

  const handleChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const preview = fillParagraphTemplate(item.content || "", values);

  const handleInsert = () => {
    if (onSubmit) {
      onSubmit(preview, item);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-900/30 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Fill Variables
              </h3>
              <p className="mt-1 text-sm text-slate-500">{item.title}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            {variables.map((variable) => (
              <label key={variable} className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {prettifyKey(variable)}
                </span>
                <input
                  type="text"
                  value={values[variable] || ""}
                  onChange={(e) => handleChange(variable, e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                  placeholder={`Enter ${prettifyKey(variable).toLowerCase()}`}
                />
              </label>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Preview
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {preview}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 px-5 py-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleInsert}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Insert Paragraph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
