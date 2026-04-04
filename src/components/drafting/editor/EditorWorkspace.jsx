import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import DocumentComposer from "./DocumentComposer";
import InsertBlockMenu from "./InsertBlockMenu";
import PreviewDrawer from "./PreviewDrawer";
import DocumentSettingsModal from "./DocumentSettingsModal";
import OfficeProfileModal from "./OfficeProfileModal";
import useOfficeProfile from "../features/hooks/useOfficeProfile";
import usePreferences from "../features/hooks/usePreferences";
import {
  canDeleteBlock,
  createBlock,
  getInsertableBlockTypes,
  normalizeBlockOrders,
} from "../features/utils/blockHelpers";

import { exportDraftToDocx } from "../features/services/docxExport";
import { buildDraftDocumentHtml } from "../features/utils/renderDraftHtml";
// import { FaRegCopy, FaPrint } from "react-icons/fa";
// import { FiFileText } from "react-icons/fi";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { FaRegCopy, FaPrint, FaRegEye, FaBuilding } from "react-icons/fa";
import { FiSettings, FiPlus } from "react-icons/fi";

EditorWorkspace.propTypes = {
  draft: PropTypes.object,
  onDraftChange: PropTypes.func.isRequired,
};

function joinIncludedLines(items) {
  return items
    .filter((item) => item.include && item.value?.trim())
    .map((item) => item.value.trim())
    .join("\n");
}

function applyOfficeProfileToBlocks(blocks, officeProfile) {
  return blocks.map((block) => {
    if (block.type === "government_identity") {
      return {
        ...block,
        content: joinIncludedLines([
          {
            include: officeProfile.includeGovtLineEn,
            value: officeProfile.govtLineEn,
          },
          {
            include: officeProfile.includeGovtLineHi,
            value: officeProfile.govtLineHi,
          },
        ]),
      };
    }

    if (block.type === "department_identity") {
      return {
        ...block,
        content: joinIncludedLines([
          {
            include: officeProfile.includeDepartmentEn,
            value: officeProfile.departmentEn,
          },
          {
            include: officeProfile.includeDepartmentHi,
            value: officeProfile.departmentHi,
          },
        ]),
      };
    }

    if (block.type === "place_date_line") {
      return {
        ...block,
        content: {
          place: officeProfile.includeCity ? officeProfile.city || "" : "",
          date:
            typeof block.content === "object" && block.content?.date
              ? block.content.date
              : "",
        },
      };
    }

    if (block.type === "sender_name_block") {
      return {
        ...block,
        content: officeProfile.includeSignatoryName
          ? officeProfile.defaultSignatoryName
          : "",
      };
    }

    if (block.type === "sender_designation_block") {
      return {
        ...block,
        content: officeProfile.includeSignatoryDesignation
          ? officeProfile.defaultSignatoryDesignation
          : "",
      };
    }

    if (block.type === "signature_block") {
      return {
        ...block,
        content: officeProfile.includeSignatoryName
          ? officeProfile.defaultSignatoryName
          : "",
      };
    }

    if (block.type === "designation_contact_block") {
      return {
        ...block,
        content: joinIncludedLines([
          {
            include: officeProfile.includeSignatoryDesignation,
            value: officeProfile.defaultSignatoryDesignation,
          },
          {
            include: officeProfile.includePhone,
            value: officeProfile.defaultPhone,
          },
          {
            include: officeProfile.includeEmail,
            value: officeProfile.defaultEmail,
          },
        ]),
      };
    }

    if (block.type === "contact_line") {
      return {
        ...block,
        content: joinIncludedLines([
          {
            include: officeProfile.includePhone,
            value: officeProfile.defaultPhone,
          },
          {
            include: officeProfile.includeEmail,
            value: officeProfile.defaultEmail,
          },
        ]),
      };
    }

    return block;
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isRichTextBlock(type) {
  return (
    type === "subject_block" ||
    type === "body_paragraph" ||
    type === "intro_phrase_block"
  );
}
function buildPlainText(draft) {
  return draft.blocks
    .map((block) => {
      if (block.type === "subject_block") {
        const subjectText = isRichTextBlock(block.type)
          ? stripHtml(block.content || block.placeholder || "")
          : block.content || block.placeholder || "";

        return `Subject: ${subjectText}`;
      }

      if (block.type === "place_date_line") {
        const place = block.content?.place || "";
        const date = block.content?.date || "";
        return `${place}\nDated ${date}`;
      }

      if (block.type === "body_table") {
        const title = block.content?.title ? `${block.content.title}\n` : "";
        const rows = Array.isArray(block.content?.rows)
          ? block.content.rows
          : [];
        const tableText = rows.map((row) => row.join(" | ")).join("\n");
        return `${title}${tableText}`.trim();
      }

      if (isRichTextBlock(block.type)) {
        return stripHtml(block.content || block.placeholder || "");
      }

      return block.content || block.placeholder || "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function renderWordTable(block, fontSizePx) {
  const title = block.content?.title || "";
  const rows = Array.isArray(block.content?.rows) ? block.content.rows : [];

  const tableRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell) => {
          const tag = rowIndex === 0 ? "th" : "td";
          return `<${tag} style="border:1px solid #cbd5e1;padding:8px 10px;text-align:left;vertical-align:top;">${escapeHtml(cell)}</${tag}>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div style="margin:8px 0 12px 0;">
      ${
        title
          ? `<div style="margin-bottom:6px;font-weight:600;">${escapeHtml(title)}</div>`
          : ""
      }
      <table style="width:100%;border-collapse:collapse;font-size:${fontSizePx}px;">
        ${tableRows}
      </table>
    </div>
  `;
}

function buildWordHtml(draft) {
  const fontSizePx = (draft.styling.fontSize || 12) * 1.333333;

  const htmlBlocks = draft.blocks
    .map((block) => {
      const type = block.type;

      if (type === "body_table") {
        return renderWordTable(block, fontSizePx);
      }

      if (type === "place_date_line") {
        const place = block.content?.place || "";
        const date = block.content?.date || "";

        return `
           <p style="margin:0 0 2px 0; text-align:right; line-height:${draft.styling.lineSpacing || 1};">
      ${escapeHtml(place)}
    </p>
    <p style="margin:0 0 8px 0; text-align:right; line-height:${draft.styling.lineSpacing || 1};">
      Dated ${escapeHtml(date)}
    </p>
        `;
      }

      let contentHtml = "";
      let textAlign = "left";
      let fontWeight = "400";
      let textDecoration = "none";
      let textIndent = "0";
      let textTransform = "none";
      let marginBottom = "8px";

      if (
        type === "document_number" ||
        type === "do_number" ||
        type === "government_identity" ||
        type === "department_identity" ||
        type === "communication_label"
      ) {
        textAlign = "center";
      }

      if (
        type === "signoff_block" ||
        type === "complimentary_close" ||
        type === "signature_block" ||
        type === "designation_contact_block"
      ) {
        textAlign = "right";
      }

      if (
        type === "subject_block" ||
        type === "body_paragraph" ||
        type === "intro_phrase_block"
      ) {
        textAlign = "justify";
      }

      if (type === "subject_block") {
        fontWeight = "700";
        contentHtml = `Subject: ${block.content || block.placeholder || ""}`;
      } else if (isRichTextBlock(type)) {
        contentHtml = block.content || "";
        textIndent =
          type === "body_paragraph" || type === "intro_phrase_block"
            ? `${draft.styling.bodyFirstLineIndent || 0.5}in`
            : "0";
      } else {
        contentHtml = escapeHtml(block.content || block.placeholder || "");
      }

      if (type === "communication_label") {
        fontWeight = "600";
        textTransform = "uppercase";
        if (draft.styling.underlineCommunicationLabel) {
          textDecoration = "underline";
        }
      }

      if (type === "subject_block") {
        contentHtml = `<strong>${contentHtml}</strong>`;
      }

      const lineHeight =
        type === "body_paragraph" ||
        type === "intro_phrase_block" ||
        type === "subject_block"
          ? draft.styling.bodyLineSpacing || 1.15
          : draft.styling.lineSpacing || 1;

      return `
        <p style="
    margin:0 0 ${marginBottom} 0;
    text-align:${textAlign};
    line-height:${lineHeight};
    text-indent:${textIndent};
    font-weight:${fontWeight};
    text-decoration:${textDecoration};
    text-transform:${textTransform};
    white-space:pre-wrap;
  ">
    ${contentHtml}
  </p>
      `;
    })
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body style="
        font-family:${draft.styling.fontFamily};
        font-size:${fontSizePx}px;
        color:#0f172a;
      ">
        ${htmlBlocks}
      </body>
    </html>
  `;
}

function openPrintWindow(draft) {
  const html = buildDraftDocumentHtml(draft);
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("Unable to open print window.");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };
}

export default function EditorWorkspace({ draft, onDraftChange }) {
  const [activeBlockId, setActiveBlockId] = useState(
    draft?.blocks?.[0]?.id || null,
  );
  const [insertMenuOpen, setInsertMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [insertAfterBlockId, setInsertAfterBlockId] = useState(null);

  const { saveOfficeProfile } = useOfficeProfile();
  const { updatePreferences } = usePreferences();

  const blocks = useMemo(() => draft?.blocks || [], [draft?.blocks]);

  useEffect(() => {
    if (!blocks.length) {
      setActiveBlockId(null);
      return;
    }

    const exists = blocks.some((block) => block.id === activeBlockId);
    if (!exists) {
      setActiveBlockId(blocks[0].id);
    }
  }, [blocks, activeBlockId]);

  if (!draft) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Draft not found.
      </div>
    );
  }

  const showToast = (message, kind = "success") => {
    setToast({ message, kind });
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(null), 2200);
  };

  const handleCopyForWord = async () => {
    const html = buildWordHtml(draft);
    const text = buildPlainText(draft);

    try {
      if (window.ClipboardItem && navigator.clipboard?.write) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        showToast("Copied for Word with formatting.", "success");
      } else {
        await navigator.clipboard.writeText(text);
        showToast("Copied as plain text. Formatting may reduce.", "warning");
      }
    } catch (error) {
      console.error("Failed to copy for Word:", error);
      showToast("Copy failed.", "warning");
    }
  };

  const handleDownloadDocx = async () => {
    try {
      await exportDraftToDocx(draft);
      showToast("DOCX downloaded.", "success");
    } catch (error) {
      console.error("Failed to export DOCX:", error);
      showToast("DOCX export failed.", "warning");
    }
  };

  const handlePrint = () => {
    try {
      openPrintWindow(draft);
    } catch (error) {
      console.error("Print failed:", error);
      showToast("Print failed.", "warning");
    }
  };

  // const handleDownloadPdf = () => {
  //   try {
  //     openPrintWindow(draft);
  //     showToast("Use Save as PDF in the print dialog.", "success");
  //   } catch (error) {
  //     console.error("PDF export failed:", error);
  //     showToast("PDF export failed.", "warning");
  //   }
  // };

  const updateStyle = (key, value) => {
    onDraftChange((prev) => ({
      ...prev,
      styling: {
        ...prev.styling,
        [key]: value,
      },
    }));
  };

  const updateBlock = (blockId, content) => {
    onDraftChange((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block,
      ),
    }));
  };

  const handleSaveDocumentSettings = (nextSettings) => {
    const savedSettings = updatePreferences(nextSettings);

    onDraftChange((prev) => ({
      ...prev,
      styling: {
        ...prev.styling,
        ...savedSettings,
      },
    }));

    setSettingsOpen(false);
  };

  const handleSaveOfficeProfile = (nextProfile) => {
    const savedProfile = saveOfficeProfile(nextProfile);

    onDraftChange((prev) => ({
      ...prev,
      officeProfile: savedProfile,
      blocks: applyOfficeProfileToBlocks(prev.blocks, savedProfile),
    }));

    setProfileOpen(false);
  };

  const addBlock = (type) => {
    onDraftChange((prev) => {
      const nextBlock = createBlock(type);
      const currentBlocks = [...(prev.blocks || [])];

      if (!insertAfterBlockId) {
        return {
          ...prev,
          blocks: normalizeBlockOrders([...currentBlocks, nextBlock]),
        };
      }

      const index = currentBlocks.findIndex((b) => b.id === insertAfterBlockId);

      if (index < 0) {
        return {
          ...prev,
          blocks: normalizeBlockOrders([...currentBlocks, nextBlock]),
        };
      }

      currentBlocks.splice(index + 1, 0, nextBlock);

      return {
        ...prev,
        blocks: normalizeBlockOrders(currentBlocks),
      };
    });

    setInsertAfterBlockId(null);
  };

  const moveBlock = (blockId, direction) => {
    onDraftChange((prev) => {
      const current = [...(prev.blocks || [])];
      const index = current.findIndex((block) => block.id === blockId);
      if (index < 0) return prev;

      const target = current[index];
      if (target.isLockedPosition) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      if (current[targetIndex].isLockedPosition) return prev;

      [current[index], current[targetIndex]] = [
        current[targetIndex],
        current[index],
      ];

      return {
        ...prev,
        blocks: normalizeBlockOrders(current),
      };
    });
  };

  const deleteBlock = (blockId) => {
    onDraftChange((prev) => {
      if (!canDeleteBlock(prev.blocks, blockId)) return prev;

      return {
        ...prev,
        blocks: normalizeBlockOrders(
          prev.blocks.filter((block) => block.id !== blockId),
        ),
      };
    });
  };

  const insertableBlocks = getInsertableBlockTypes(blocks);

  return (
    <div className="space-y-5">
      <div className="sticky top-[60px] z-10 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              setInsertAfterBlockId(null);
              setInsertMenuOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-slate-800 hover:shadow-[0px_8px_18px_rgba(15,23,42,0.16)] active:translate-y-0"
          >
            <FiPlus className="text-sm" />
            <span>Insert block</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0px_8px_20px_rgba(15,23,42,0.08)] active:translate-y-0"
          >
            <FaRegEye className="text-sm" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0px_8px_20px_rgba(15,23,42,0.08)] active:translate-y-0"
          >
            <FiSettings className="text-sm" />
            <span>Document settings</span>
          </button>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0px_8px_20px_rgba(15,23,42,0.08)] active:translate-y-0"
          >
            <FaBuilding className="text-sm" />
            <span>Office profile</span>
          </button>

          <div className="mx-2 hidden h-8 w-px bg-slate-300/70 lg:block" />

          <button
            type="button"
            onClick={handleCopyForWord}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0px_8px_20px_rgba(15,23,42,0.08)] active:translate-y-0"
          >
            <FaRegCopy className="text-sm" />
            <span>Copy Text</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0px_8px_20px_rgba(15,23,42,0.08)] active:translate-y-0"
          >
            <PiMicrosoftWordLogoFill className="text-base" />
            <span>Download DOCX</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-800 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0px_8px_20px_rgba(15,23,42,0.08)] active:translate-y-0"
          >
            <FaPrint className="text-sm" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <DocumentComposer
        draft={draft}
        activeBlockId={activeBlockId}
        onBlockFocus={setActiveBlockId}
        onBlockChange={updateBlock}
        onMoveUp={(blockId) => moveBlock(blockId, "up")}
        onMoveDown={(blockId) => moveBlock(blockId, "down")}
        onDelete={deleteBlock}
        onInsertRequest={(blockId) => {
          setInsertAfterBlockId(blockId);
          setInsertMenuOpen(true);
        }}
      />

      <InsertBlockMenu
        open={insertMenuOpen}
        onClose={() => setInsertMenuOpen(false)}
        insertableBlocks={insertableBlocks}
        onAddBlock={addBlock}
        draftType={draft.type}
      />

      <DocumentSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        styling={draft.styling}
        onStyleChange={updateStyle}
        onSave={handleSaveDocumentSettings}
      />

      <OfficeProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        officeProfile={draft.officeProfile}
        onSave={handleSaveOfficeProfile}
      />

      <PreviewDrawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        draft={draft}
      />

      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-4 py-2 text-sm font-medium shadow-lg ${
            toast.kind === "success"
              ? "bg-slate-900 text-white"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
