import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import PreferencesForm from "../../../components/drafting/preferences/PreferencesForm";
import PreviewStyleCard from "../../../components/drafting/preferences/PreviewStyleCard";
import usePreferences from "../../../components/drafting/features/hooks/usePreferences";

export default function PreferencesPage() {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();

  return (
    <DraftingLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Drafting preferences"
          subtitle="Set your preferred drafting environment so every new document starts in a familiar style."
        />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <PreferencesForm
            preferences={preferences}
            onChange={updatePreferences}
            onReset={resetPreferences}
          />

          <PreviewStyleCard preferences={preferences} />
        </div>
      </div>
    </DraftingLayout>
  );
}
