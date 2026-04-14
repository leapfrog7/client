import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import ParagraphBankList from "./ParagraphBankList";
import ParagraphBankEditorModal from "./ParagraphBankEditorModal";
import SmartParagraphFieldsModal from "./SmartParagraphFieldsModal";
import useParagraphBank from "../features/hooks/useParagraphBank";

ParagraphBankDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onInsertParagraph: PropTypes.func,
};

export default function ParagraphBankDrawer({
  open,
  onClose,
  onInsertParagraph,
}) {
  const { items, removeItem } = useParagraphBank();
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [smartModalOpen, setSmartModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const content = String(item.content || "").toLowerCase();
      const category = String(item.category || "").toLowerCase();
      const tags = Array.isArray(item.tags)
        ? item.tags.join(" ").toLowerCase()
        : "";

      return (
        title.includes(q) ||
        content.includes(q) ||
        category.includes(q) ||
        tags.includes(q)
      );
    });
  }, [items, query]);

  if (!open) return null;

  const handleNew = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleInsert = (item) => {
    if (item.type === "template") {
      setSelectedItem(item);
      setSmartModalOpen(true);
      return;
    }

    if (onInsertParagraph) {
      onInsertParagraph(item.content, item);
    }
    onClose();
  };

  const handleSmartInsert = (filledContent, item) => {
    if (onInsertParagraph) {
      onInsertParagraph(filledContent, item);
    }
    setSelectedItem(null);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30">
        <div className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Paragraph Bank
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Insert saved reusable paragraphs into the draft.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search paragraphs..."
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={handleNew}
                className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                New
              </button>
            </div>
          </div>

          <div className="p-5">
            <ParagraphBankList
              items={filteredItems}
              onInsert={handleInsert}
              onEdit={handleEdit}
              onDelete={removeItem}
            />
          </div>
        </div>
      </div>

      <ParagraphBankEditorModal
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
      />

      <SmartParagraphFieldsModal
        open={smartModalOpen}
        onClose={() => {
          setSmartModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSubmit={handleSmartInsert}
      />
    </>
  );
}
