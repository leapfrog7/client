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
      <div className="space-y-6 p-2 md:p-0">
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

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Backup & Restore
              </div>

              <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                Move your drafting setup safely
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Export a backup to move your drafting setup to another device.
                The backup includes office profile, signatory profiles, document
                settings, paragraph bank, and saved drafts.
              </p>

              <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs leading-5 text-amber-800 sm:text-sm">
                  Importing a backup will replace the current local drafting
                  data on this device.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-end">
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.75v9.5m0 0 3.25-3.25M12 14.25l-3.25-3.25"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.75 15.75v1.5A2.75 2.75 0 0 0 8.5 20h7a2.75 2.75 0 0 0 2.75-2.75v-1.5"
                  />
                </svg>
                Export backup
              </button>

              <button
                type="button"
                onClick={handleImportBackupClick}
                disabled={importingBackup}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19.25v-9.5m0 0 3.25 3.25M12 9.75l-3.25 3.25"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.75 8.25v-1.5A2.75 2.75 0 0 1 8.5 4h7a2.75 2.75 0 0 1 2.75 2.75v1.5"
                  />
                </svg>
                {importingBackup ? "Importing..." : "Import backup"}
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
      </div>
    </DraftingLayout>
  );
}
