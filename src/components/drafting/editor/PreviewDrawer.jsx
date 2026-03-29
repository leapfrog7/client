// import PropTypes from "prop-types";
// // import { useState } from "react";
// import {
//   A4_WIDTH_PX,
//   A4_HEIGHT_PX,
//   MS_WORD_MARGIN_PX,
// } from "./DocumentComposer";
// // import { exportDraftToDocx } from "../features/services/docxExport";

// PreviewDrawer.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   draft: PropTypes.shape({
//     blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
//     styling: PropTypes.object.isRequired,
//   }).isRequired,
// };

// function getPreviewClass(type, underlineCommunicationLabel = true) {
//   switch (type) {
//     case "document_number":
//     case "do_number":
//     case "government_identity":
//     case "department_identity":
//       return "text-center";

//     case "place_date_line":
//       return "text-right";

//     case "communication_label":
//       return underlineCommunicationLabel
//         ? "text-center font-semibold uppercase underline underline-offset-4"
//         : "text-center font-semibold uppercase";

//     case "subject_block":
//       return "text-justify font-bold";

//     case "body_paragraph":
//     case "intro_phrase_block":
//       return "text-justify";

//     case "signoff_block":
//     case "complimentary_close":
//     case "signature_block":
//     case "designation_contact_block":
//       return "text-right";

//     default:
//       return "";
//   }
// }

// function getPreviewSpacing(block, prevBlockType, styling) {
//   if (!prevBlockType) return 0;

//   if (
//     prevBlockType === "document_number" &&
//     block.type === "government_identity"
//   ) {
//     return 2;
//   }

//   if (
//     prevBlockType === "government_identity" &&
//     block.type === "department_identity"
//   ) {
//     return 2;
//   }

//   if (
//     prevBlockType === "department_identity" &&
//     block.type === "place_date_line"
//   ) {
//     return 10;
//   }

//   if (
//     prevBlockType === "body_paragraph" ||
//     prevBlockType === "intro_phrase_block"
//   ) {
//     if (
//       block.type === "signoff_block" ||
//       block.type === "complimentary_close" ||
//       block.type === "signature_block" ||
//       block.type === "designation_contact_block"
//     ) {
//       return styling.signatureGap || 28;
//     }
//     return styling.bodyParagraphSpacing || 8;
//   }

//   if (
//     prevBlockType === "signature_block" &&
//     block.type === "designation_contact_block"
//   ) {
//     return 0;
//   }

//   if (prevBlockType === "communication_label") return 12;

//   if (
//     prevBlockType === "subject_block" &&
//     (block.type === "body_paragraph" || block.type === "intro_phrase_block")
//   ) {
//     return styling.bodyParagraphSpacing || 8;
//   }

//   return styling.paragraphSpacing || 4;
// }

// function getPreviewText(block) {
//   if (block.type === "subject_block") {
//     return `Subject: ${block.content || block.placeholder || ""}`;
//   }

//   if (block.type === "place_date_line") {
//     const place = block.content?.place || "";
//     const date = block.content?.date || "";
//     return `${place}\nDated ${date}`;
//   }

//   return block.content || block.placeholder || "";
// }

// function getPreviewStyle(block, styling) {
//   const isBody =
//     block.type === "body_paragraph" || block.type === "intro_phrase_block";

//   return {
//     lineHeight:
//       block.type === "government_identity" ||
//       block.type === "department_identity" ||
//       block.type === "document_number" ||
//       block.type === "do_number"
//         ? styling.lineSpacing || 1.05
//         : block.type === "body_paragraph" ||
//             block.type === "intro_phrase_block" ||
//             block.type === "subject_block"
//           ? styling.bodyLineSpacing || 1.15
//           : styling.lineSpacing || 1,
//     fontWeight:
//       block.type === "document_number" ||
//       block.type === "government_identity" ||
//       block.type === "department_identity"
//         ? 500
//         : undefined,
//     textIndent: isBody ? `${styling.bodyFirstLineIndent || 0.5}in` : 0,
//   };
// }

// function Toast({ message, kind }) {
//   return (
//     <div
//       className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-4 py-2 text-sm font-medium shadow-lg ${
//         kind === "success"
//           ? "bg-slate-900 text-white"
//           : "bg-amber-100 text-amber-900"
//       }`}
//     >
//       {message}
//     </div>
//   );
// }

// Toast.propTypes = {
//   message: PropTypes.string.isRequired,
//   kind: PropTypes.oneOf(["success", "warning"]).isRequired,
// };

// export default function PreviewDrawer({ open, onClose, draft }) {
//   // const [toast, setToast] = useState(null);

//   if (!open) return null;

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25">
//         <div className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
//           <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
//             <div>
//               <h3 className="text-base font-semibold text-slate-900">
//                 Preview
//               </h3>
//               <p className="mt-1 text-sm text-slate-500">
//                 Quick visual feel of final output
//               </p>
//             </div>

//             <div className="flex gap-2">
//               {/* <button
//                 type="button"
//                 onClick={handleCopy}
//                 className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Copy for Word
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDownloadDocx}
//                 className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Download DOCX
//               </button> */}

//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//             </div>
//           </div>

//           <div className="bg-slate-100 p-4">
//             <div
//               className="mx-auto rounded-sm bg-white shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
//               style={{
//                 width: `${A4_WIDTH_PX}px`,
//                 maxWidth: "100%",
//                 minHeight: `${A4_HEIGHT_PX}px`,
//                 paddingTop: `${MS_WORD_MARGIN_PX}px`,
//                 paddingRight: `${MS_WORD_MARGIN_PX}px`,
//                 paddingBottom: `${MS_WORD_MARGIN_PX}px`,
//                 paddingLeft: `${MS_WORD_MARGIN_PX}px`,
//                 fontFamily: draft.styling.fontFamily,
//                 fontSize: `${draft.styling.fontSize}px`,
//               }}
//             >
//               {draft.blocks.map((block, index) => {
//                 const prevType =
//                   index > 0 ? draft.blocks[index - 1].type : null;

//                 return (
//                   <div
//                     key={block.id}
//                     className={`${getPreviewClass(
//                       block.type,
//                       draft.styling.underlineCommunicationLabel,
//                     )} whitespace-pre-wrap text-slate-900`}
//                     style={{
//                       marginTop: `${getPreviewSpacing(
//                         block,
//                         prevType,
//                         draft.styling,
//                       )}px`,
//                       ...getPreviewStyle(block, draft.styling),
//                     }}
//                   >
//                     {getPreviewText(block)}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* {toast ? <Toast message={toast.message} kind={toast.kind} /> : null} */}
//     </>
//   );
// }
import PropTypes from "prop-types";
import { useRef, useState } from "react";
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

export default function PreviewDrawer({ open, onClose, draft }) {
  const previewPageRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!open) return null;

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
                className=" hidden rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                width: `${A4_WIDTH_PX}px`,
                maxWidth: "100%",
                minHeight: `${A4_HEIGHT_PX}px`,
                paddingTop: `${MS_WORD_MARGIN_PX}px`,
                paddingRight: `${MS_WORD_MARGIN_PX}px`,
                paddingBottom: `${MS_WORD_MARGIN_PX}px`,
                paddingLeft: `${MS_WORD_MARGIN_PX}px`,
                fontFamily: draft.styling.fontFamily,
                fontSize: `${draft.styling.fontSize}px`,
                background: "#fff",
              }}
            >
              {draft.blocks.map((block, index) => {
                const prevType =
                  index > 0 ? draft.blocks[index - 1].type : null;

                return (
                  <div
                    key={block.id}
                    className={`${getDraftBlockClass(
                      block.type,
                      draft.styling.underlineCommunicationLabel,
                    )} whitespace-pre-wrap break-words text-slate-900`}
                    style={{
                      marginTop: `${getDraftBlockSpacing(
                        block,
                        prevType,
                        draft.styling,
                      )}px`,
                      ...getDraftBlockStyle(block, draft.styling),
                    }}
                  >
                    {getDraftBlockText(block)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} /> : null}
    </>
  );
}
