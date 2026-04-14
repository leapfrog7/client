import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  MS_WORD_MARGIN_PX,
} from "./DocumentComposer";
import {
  getDraftBlockClass,
  getDraftBlockSpacing,
  getDraftBlockStyle,
  getDraftBlockText,
  getDraftBlockHtml,
} from "../features/utils/draftRenderMetrics";

PreviewDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  draft: PropTypes.shape({
    blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
    styling: PropTypes.object.isRequired,
    title: PropTypes.string,
  }).isRequired,
};

function Toast({ message, kind }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-4 py-2 text-sm font-medium shadow-lg ${
        kind === "success"
          ? "bg-slate-900 text-white"
          : "bg-amber-100 text-amber-900"
      }`}
    >
      {message}
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  kind: PropTypes.oneOf(["success", "warning"]).isRequired,
};

function renderPreviewBlock(block, prevType, styling) {
  if (block.type === "body_table") {
    const title = block.content?.title || "";
    const rows = block.content?.rows || [];
    const hasHeaderRow = block.content?.hasHeaderRow ?? true;

    return (
      <div
        key={block.id}
        style={{
          marginTop: `${getDraftBlockSpacing(block, prevType, styling)}px`,
        }}
      >
        {title ? (
          <div className="mb-2 font-semibold text-slate-900">{title}</div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-slate-900">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const Tag = hasHeaderRow && rowIndex === 0 ? "th" : "td";

                    return (
                      <Tag
                        key={`${rowIndex}-${colIndex}`}
                        className={`border border-slate-300 px-3 py-2 text-left align-top ${
                          hasHeaderRow && rowIndex === 0
                            ? "bg-slate-50 font-semibold"
                            : "font-normal"
                        }`}
                      >
                        {cell}
                      </Tag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const richHtml = getDraftBlockHtml(block);

  if (block.type === "subject_block" && richHtml) {
    return (
      <div
        key={block.id}
        className={`${getDraftBlockClass(
          block.type,
          styling.underlineCommunicationLabel,
        )} whitespace-pre-wrap break-words text-slate-900`}
        style={{
          marginTop: `${getDraftBlockSpacing(block, prevType, styling)}px`,
          ...getDraftBlockStyle(block, styling),
        }}
      >
        <div className="flex items-start gap-2">
          <span className="shrink-0 font-bold text-slate-900">Subject:</span>
          <div
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: richHtml }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      key={block.id}
      className={`${getDraftBlockClass(
        block.type,
        styling.underlineCommunicationLabel,
      )} whitespace-pre-wrap break-words text-slate-900`}
      style={{
        marginTop: `${getDraftBlockSpacing(block, prevType, styling)}px`,
        ...getDraftBlockStyle(block, styling),
      }}
      {...(supportsRichPreview(block.type) && richHtml
        ? { dangerouslySetInnerHTML: { __html: richHtml } }
        : {})}
    >
      {!supportsRichPreview(block.type) || !richHtml
        ? getDraftBlockText(block)
        : null}
    </div>
  );
}

function supportsRichPreview(type) {
  return (
    type === "subject_block" ||
    type === "body_paragraph" ||
    type === "intro_phrase_block"
  );
}

export default function PreviewDrawer({ open, onClose, draft }) {
  const previewPageRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!open) return null;

  const mobileFontScale = 0.9;
  const previewPaddingPx = isMobile ? 30 : MS_WORD_MARGIN_PX;
  const previewMinHeight = isMobile ? "auto" : `${A4_HEIGHT_PX}px`;
  const baseFontSizePx = (draft.styling.fontSize || 12) * 1.333333;
  const previewFontSizePx = `${
    isMobile ? baseFontSizePx * mobileFontScale : baseFontSizePx
  }px`;

  const showToast = (message, kind = "success") => {
    setToast({ message, kind });
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(null), 2200);
  };

  const handleDownloadPdf = async () => {
    if (!previewPageRef.current) return;

    try {
      setDownloadingPdf(true);

      const canvas = await html2canvas(previewPageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${draft.title || "draft"}.pdf`);

      showToast("PDF downloaded.", "success");
    } catch (error) {
      console.error("Failed to generate PDF from preview:", error);
      showToast("PDF download failed.", "warning");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25">
        <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Preview
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                This is the final document view.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="hidden rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloadingPdf ? "Preparing PDF..." : "Download PDF"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>

          <div className="bg-slate-100 p-4">
            <div
              ref={previewPageRef}
              className="mx-auto rounded-sm bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
              style={{
                width: "100%",
                maxWidth: `${A4_WIDTH_PX}px`,
                minHeight: previewMinHeight,
                paddingTop: `${previewPaddingPx}px`,
                paddingRight: `${previewPaddingPx}px`,
                paddingBottom: `${previewPaddingPx}px`,
                paddingLeft: `${previewPaddingPx}px`,
                fontFamily: draft.styling.fontFamily,
                fontSize: previewFontSizePx,
                background: "#fff",
              }}
            >
              {draft.blocks.map((block, index) => {
                const prevType =
                  index > 0 ? draft.blocks[index - 1].type : null;

                return renderPreviewBlock(block, prevType, draft.styling);
              })}
            </div>
          </div>
        </div>
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} /> : null}
    </>
  );
}
