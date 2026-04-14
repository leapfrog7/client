import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useParagraphBank from "../features/hooks/useParagraphBank";
import { PARAGRAPH_BANK_CATEGORIES } from "../features/constants/paragraphBankCategories";

ParagraphBankEditorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
};

const INITIAL_FORM = {
  title: "",
  category: "General",
  type: "static",
  content: "",
  tags: "",
  isFavorite: false,
};

function getFormFromItem(item) {
  if (!item) return INITIAL_FORM;

  return {
    title: item.title || "",
    category: item.category || "General",
    type: item.type || "static",
    content: item.content || "",
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    isFavorite: Boolean(item.isFavorite),
  };
}

export default function ParagraphBankEditorModal({ open, onClose, item }) {
  const { saveItem } = useParagraphBank();
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (open) {
      setForm(getFormFromItem(item));
    } else {
      setForm(INITIAL_FORM);
    }
  }, [open, item]);

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const payload = {
      id: item?.id,
      title: form.title.trim(),
      category: form.category,
      type: form.type,
      content: form.content.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isFavorite: form.isFavorite,
      createdAt: item?.createdAt,
    };

    if (!payload.title || !payload.content) return;

    saveItem(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/30 p-3">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl xl:max-w-6xl">
        <div className="shrink-0 px-8 py-4 bg-zinc-200 rounded-xl">
          <div className="flex items-center justify-between gap-4 ">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {item ? "Edit Paragraph" : "Save Paragraph"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Create a reusable static or smart paragraph.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                {item ? "Update Paragraph" : "Save Paragraph"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
          {form.type === "template" ? (
            <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              Use placeholders like <code>{"{{amount}}"}</code> and{" "}
              <code>{"{{payee}}"}</code>.
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Title
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                placeholder="e.g. Bill sanction paragraph"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Category
              </span>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              >
                {PARAGRAPH_BANK_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Type
              </span>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option value="static">Static paragraph</option>
                <option value="template">Smart paragraph</option>
              </select>
            </label>

            <label className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                checked={form.isFavorite}
                onChange={(e) => updateField("isFavorite", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-slate-700">Mark as favorite</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Paragraph Content
              </span>
              <textarea
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                rows={8}
                className="h-28 w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                placeholder={
                  form.type === "template"
                    ? "Use placeholders like {{amount}}, {{payee}}, {{purpose}}"
                    : "Type the reusable paragraph here..."
                }
              />
            </label>
          </div>

          <div className="my-4">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Tags
              </span>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                placeholder="Comma separated tags"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
