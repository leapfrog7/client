import { useRef, useState } from "react";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import PreferencesForm from "../../../components/drafting/preferences/PreferencesForm";
import PreviewStyleCard from "../../../components/drafting/preferences/PreviewStyleCard";
import usePreferences from "../../../components/drafting/features/hooks/usePreferences";
import {
  downloadDraftingBackupFile,
  importDraftingBackupFile,
} from "../../../components/drafting/features/services/draftingBackupTransfer";

export default function PreferencesPage() {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const [importingBackup, setImportingBackup] = useState(false);
  const fileInputRef = useRef(null);

  const handleExportBackup = () => {
    downloadDraftingBackupFile();
  };

  const handleImportBackupClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportBackupChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "Importing a backup will replace the current local drafting data on this device. Do you want to continue?",
    );

    if (!confirmed) {
      event.target.value = "";
      return;
    }

    try {
      setImportingBackup(true);
      await importDraftingBackupFile(file);
      window.location.reload();
    } catch (error) {
      console.error("Failed to import drafting backup:", error);
      window.alert(error.message || "Failed to import backup.");
    } finally {
      setImportingBackup(false);
      event.target.value = "";
    }
  };

  return (
    <DraftingLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Drafting preferences"
          subtitle="Set your preferred drafting environment so every new document starts in a familiar style."
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h3 className="text-base font-semibold text-slate-900">
                Backup and restore drafting data
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Backup lets you move your drafting setup to another system. It
                includes office profile, signatory profiles, document settings,
                paragraph bank, and saved drafts. Importing a backup will
                replace current local drafting data on this device.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Export drafting backup 🚀
              </button>

              <button
                type="button"
                onClick={handleImportBackupClick}
                disabled={importingBackup}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importingBackup ? "Importing..." : "Import drafting backup 📩"}
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportBackupChange}
            className="hidden"
          />
        </div>

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
