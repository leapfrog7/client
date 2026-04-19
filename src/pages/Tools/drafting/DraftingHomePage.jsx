import { useNavigate } from "react-router-dom";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import QuickActions from "../../../components/drafting/home/QuickActions";
import RecentDrafts from "../../../components/drafting/home/RecentDrafts";
import FavoriteTemplates from "../../../components/drafting/home/FavoriteTemplates";
import DraftingIntroCTA from "../../../components/drafting/home/DraftingIntroCTA";
import useDrafts from "../../../components/drafting/features/hooks/useDrafts";
import usePreferences from "../../../components/drafting/features/hooks/usePreferences";
import useOfficeProfile from "../../../components/drafting/features/hooks/useOfficeProfile";
import { createBlankDraft } from "../../../components/drafting/features/services/templateFactory";

export default function DraftingHomePage() {
  const navigate = useNavigate();
  const { recentDrafts, lastOpenedDraft, persistDraft } = useDrafts();
  const { preferences } = usePreferences();
  const { officeProfile } = useOfficeProfile();

  const handleCreateBlank = () => {
    const draft = createBlankDraft(preferences, officeProfile);
    const saved = persistDraft(draft);
    navigate(`/pages/tools/drafting/editor/${saved.id}`);
  };

  return (
    <DraftingLayout>
      <div className="space-y-8">
        <DraftingIntroCTA />

        <section className="space-y-4 p-2 md:p-0">
          <SectionHeader
            title="Quick actions 🎬"
            subtitle="Choose the fastest way to begin your drafting work."
          />
          <QuickActions
            lastOpenedDraftId={lastOpenedDraft?.id || null}
            onCreateBlank={handleCreateBlank}
          />
        </section>

        <section className="space-y-4 p-2 md:p-0">
          <SectionHeader
            title="Recent drafts ⌛"
            subtitle="Reopen the documents you worked on most recently."
          />
          <RecentDrafts drafts={recentDrafts} />
        </section>

        <section className="space-y-4 p-2 md:p-0">
          <SectionHeader
            title="Popular templates 🔥"
            subtitle="Start from common government communication formats."
          />
          <FavoriteTemplates />
        </section>
      </div>
    </DraftingLayout>
  );
}
