import { Routes, Route, Navigate } from "react-router-dom";
import DraftingHomePage from "./DraftingHomePage";
import TemplateGalleryPage from "./TemplateGalleryPage";
import DraftLibraryPage from "./DraftLibraryPage";
import PreferencesPage from "./PreferencesPage";
import DraftEditorPage from "./DraftEditorPage";
import ParagraphBankPage from "../../../pages/Tools/drafting/ParagraphBankPage";

export default function DraftingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DraftingHomePage />} />
      <Route path="/templates" element={<TemplateGalleryPage />} />
      <Route path="/drafts" element={<DraftLibraryPage />} />
      <Route path="/preferences" element={<PreferencesPage />} />
      <Route path="/editor/:draftId" element={<DraftEditorPage />} />
      <Route path="paragraph-bank" element={<ParagraphBankPage />} />
      <Route
        path="*"
        element={<Navigate to="/pages/tools/drafting" replace />}
      />
    </Routes>
  );
}
