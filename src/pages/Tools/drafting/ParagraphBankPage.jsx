import { useMemo, useState } from "react";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import ParagraphBankList from "../../../components/drafting/paragraphBank/ParagraphBankList";
import ParagraphBankEditorModal from "../../../components/drafting/paragraphBank/ParagraphBankEditorModal";
import useParagraphBank from "../../../components/drafting/features/hooks/useParagraphBank";

export default function ParagraphBankPage() {
  const { items, removeItem } = useParagraphBank();
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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

  const handleNew = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  return (
    <DraftingLayout statusLabel="Paragraph Bank">
      <div className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <SectionHeader
                title="Paragraph Bank"
                subtitle="Save frequently used paragraphs and reusable smart paragraphs with placeholders."
              />
            </div>

            <button
              type="button"
              onClick={handleNew}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              New Paragraph
            </button>
          </div>

          <div className="mt-5">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved paragraphs..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <ParagraphBankList
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={removeItem}
          />
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
    </DraftingLayout>
  );
}
