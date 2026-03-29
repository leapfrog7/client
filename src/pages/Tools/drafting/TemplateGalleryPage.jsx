import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import SearchInput from "../../../components/drafting/common/SearchInput";
import TemplateGallery from "../../../components/drafting/templates/TemplateGallery";
import TemplatePreviewDrawer from "../../../components/drafting/templates/TemplatePreviewDrawer";
import { SYSTEM_TEMPLATES } from "../../../components/drafting/features/data/systemTemplates";
import { createDraftFromTemplate } from "../../../components/drafting/features/services/templateFactory";
import useDrafts from "../../../components/drafting/features/hooks/useDrafts";
import usePreferences from "../../../components/drafting/features/hooks/usePreferences";
import useOfficeProfile from "../../../components/drafting/features/hooks/useOfficeProfile";

export default function TemplateGalleryPage() {
  const navigate = useNavigate();
  const { persistDraft } = useDrafts();
  const { preferences } = usePreferences();
  const { officeProfile } = useOfficeProfile();

  const [query, setQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SYSTEM_TEMPLATES;

    return SYSTEM_TEMPLATES.filter(
      (template) =>
        template.name.toLowerCase().includes(normalized) ||
        template.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  const handleUseTemplate = (template) => {
    const draft = createDraftFromTemplate(template, preferences, officeProfile);
    const saved = persistDraft(draft);
    navigate(`/pages/tools/drafting/editor/${saved.id}`);
  };

  return (
    <DraftingLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Template gallery"
          subtitle="Choose a standard communication format and start drafting with a clean structure."
          action={
            <div className="w-full sm:w-72">
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
              />
            </div>
          }
        />

        <TemplateGallery
          templates={filteredTemplates}
          onPreview={setSelectedTemplate}
          onUseTemplate={handleUseTemplate}
        />

        <TemplatePreviewDrawer
          open={Boolean(selectedTemplate)}
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUseTemplate={handleUseTemplate}
        />
      </div>
    </DraftingLayout>
  );
}
