import { useMemo, useState } from "react";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import DraftFilters from "../../../components/drafting/drafts/DraftFilters";
import DraftList from "../../../components/drafting/drafts/DraftList";
import useDrafts from "../../../components/drafting/features/hooks/useDrafts";

export default function DraftLibraryPage() {
  const { drafts, cloneDraft, removeDraft } = useDrafts();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => {
      const matchesQuery = draft.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      const matchesType = type === "all" ? true : draft.type === type;

      return matchesQuery && matchesType;
    });
  }, [drafts, query, type]);

  return (
    <DraftingLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Draft library"
          subtitle="Browse, reopen, duplicate, or remove your locally saved drafts."
        />

        <DraftFilters
          query={query}
          type={type}
          onQueryChange={(e) => setQuery(e.target.value)}
          onTypeChange={(e) => setType(e.target.value)}
        />

        <DraftList
          drafts={filteredDrafts}
          onDuplicate={cloneDraft}
          onDelete={removeDraft}
        />
      </div>
    </DraftingLayout>
  );
}
