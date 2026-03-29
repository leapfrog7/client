// import { getDraftBlockSpacing, getDraftBlockText } from "./draftRenderMetrics";

// function escapeHtml(value) {
//   return String(value || "")
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;")
//     .replaceAll("'", "&#39;");
// }

// function getBlockAlignment(type) {
//   if (
//     type === "document_number" ||
//     type === "do_number" ||
//     type === "government_identity" ||
//     type === "department_identity" ||
//     type === "communication_label"
//   ) {
//     return "center";
//   }

//   if (
//     type === "place_date_line" ||
//     type === "signoff_block" ||
//     type === "complimentary_close" ||
//     type === "signature_block" ||
//     type === "designation_contact_block"
//   ) {
//     return "right";
//   }

//   if (
//     type === "subject_block" ||
//     type === "body_paragraph" ||
//     type === "intro_phrase_block"
//   ) {
//     return "justify";
//   }

//   return "left";
// }

// function getBlockLineHeight(type, styling) {
//   if (
//     type === "government_identity" ||
//     type === "department_identity" ||
//     type === "document_number" ||
//     type === "do_number"
//   ) {
//     return styling.lineSpacing || 1;
//   }

//   if (
//     type === "body_paragraph" ||
//     type === "intro_phrase_block" ||
//     type === "subject_block"
//   ) {
//     return styling.bodyLineSpacing || 1.15;
//   }

//   return styling.lineSpacing || 1;
// }

// function getBlockFontWeight(type) {
//   if (type === "subject_block") return "700";

//   if (
//     type === "document_number" ||
//     type === "government_identity" ||
//     type === "department_identity"
//   ) {
//     return "500";
//   }

//   if (type === "communication_label") {
//     return "600";
//   }

//   return "400";
// }

// function getBlockTextDecoration(type, styling) {
//   if (type === "communication_label" && styling.underlineCommunicationLabel) {
//     return "underline";
//   }

//   return "none";
// }

// function getBlockTextTransform(type) {
//   return type === "communication_label" ? "uppercase" : "none";
// }

// function getBlockTextIndent(type, styling) {
//   if (type === "body_paragraph" || type === "intro_phrase_block") {
//     return `${styling.bodyFirstLineIndent || 0.5}in`;
//   }

//   return "0";
// }

// function renderBlockHtml(block, prevType, styling) {
//   const text = getDraftBlockText(block);

//   return `
//     <div
//       style="
//         margin-top:${getDraftBlockSpacing(block, prevType, styling)}px;
//         text-align:${getBlockAlignment(block.type)};
//         line-height:${getBlockLineHeight(block.type, styling)};
//         font-weight:${getBlockFontWeight(block.type)};
//         text-decoration:${getBlockTextDecoration(block.type, styling)};
//         text-transform:${getBlockTextTransform(block.type)};
//         text-indent:${getBlockTextIndent(block.type, styling)};
//         white-space:pre-wrap;
//         word-break:break-word;
//       "
//     >
//       ${escapeHtml(text)}
//     </div>
//   `;
// }

// export function buildDraftDocumentHtml(draft) {
//   const pageWidth = 794;
//   const pageHeight = 1123;
//   const marginPx = Math.round((draft.styling.pageMargin || 1) * 96);

//   const blocksHtml = draft.blocks
//     .map((block, index) => {
//       const prevType = index > 0 ? draft.blocks[index - 1].type : null;
//       return renderBlockHtml(block, prevType, draft.styling);
//     })
//     .join("");

//   return `
//     <!doctype html>
//     <html>
//       <head>
//         <meta charset="utf-8" />
//         <title>${escapeHtml(draft.title || "Draft")}</title>
//         <style>
//           @page {
//             size: A4;
//             margin: 0;
//           }

//           html, body {
//             margin: 0;
//             padding: 0;
//             background: white;
//           }

//           body {
//             font-family: ${draft.styling.fontFamily};
//             font-size: ${draft.styling.fontSize}px;
//             color: #0f172a;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           .print-root {
//             width: 100%;
//             display: flex;
//             justify-content: center;
//             align-items: flex-start;
//             background: white;
//           }

//           .draft-page {
//             width: ${pageWidth}px;
//             min-height: ${pageHeight}px;
//             box-sizing: border-box;
//             padding: ${marginPx}px;
//             background: white;
//           }

//           @media screen {
//             body {
//               background: #f1f5f9;
//               padding: 16px;
//             }

//             .draft-page {
//               box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
//             }
//           }

//           @media print {
//             html, body {
//               width: ${pageWidth}px;
//               height: ${pageHeight}px;
//               overflow: hidden;
//               background: white;
//             }

//             .print-root {
//               display: block;
//               width: ${pageWidth}px;
//             }

//             .draft-page {
//               width: ${pageWidth}px;
//               min-height: ${pageHeight}px;
//               box-shadow: none;
//               page-break-after: avoid;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="print-root">
//           <div class="draft-page">
//             ${blocksHtml}
//           </div>
//         </div>
//       </body>
//     </html>
//   `;
// }

import { getDraftBlockSpacing, getDraftBlockText } from "./draftRenderMetrics";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getBlockAlignment(type) {
  if (
    type === "document_number" ||
    type === "do_number" ||
    type === "government_identity" ||
    type === "department_identity" ||
    type === "communication_label"
  ) {
    return "center";
  }

  if (
    type === "place_date_line" ||
    type === "signoff_block" ||
    type === "complimentary_close" ||
    type === "signature_block" ||
    type === "designation_contact_block"
  ) {
    return "right";
  }

  if (
    type === "subject_block" ||
    type === "body_paragraph" ||
    type === "intro_phrase_block"
  ) {
    return "justify";
  }

  return "left";
}

function getBlockLineHeight(type, styling) {
  if (
    type === "government_identity" ||
    type === "department_identity" ||
    type === "document_number" ||
    type === "do_number"
  ) {
    return styling.lineSpacing || 1;
  }

  if (
    type === "body_paragraph" ||
    type === "intro_phrase_block" ||
    type === "subject_block"
  ) {
    return styling.bodyLineSpacing || 1.15;
  }

  return styling.lineSpacing || 1;
}

function getBlockFontWeight(type) {
  if (type === "subject_block") return "700";

  if (
    type === "document_number" ||
    type === "government_identity" ||
    type === "department_identity"
  ) {
    return "500";
  }

  if (type === "communication_label") {
    return "600";
  }

  return "400";
}

function getBlockTextDecoration(type, styling) {
  if (type === "communication_label" && styling.underlineCommunicationLabel) {
    return "underline";
  }

  return "none";
}

function getBlockTextTransform(type) {
  return type === "communication_label" ? "uppercase" : "none";
}

function getBlockTextIndent(type, styling) {
  if (type === "body_paragraph" || type === "intro_phrase_block") {
    return `${styling.bodyFirstLineIndent || 0.5}in`;
  }

  return "0";
}

function renderBlockHtml(block, prevType, styling) {
  const text = getDraftBlockText(block);

  return `
    <div
      style="
        margin-top:${getDraftBlockSpacing(block, prevType, styling)}px;
        text-align:${getBlockAlignment(block.type)};
        line-height:${getBlockLineHeight(block.type, styling)};
        font-weight:${getBlockFontWeight(block.type)};
        text-decoration:${getBlockTextDecoration(block.type, styling)};
        text-transform:${getBlockTextTransform(block.type)};
        text-indent:${getBlockTextIndent(block.type, styling)};
        white-space:pre-wrap;
        word-break:break-word;
      "
    >
      ${escapeHtml(text)}
    </div>
  `;
}

export function buildDraftDocumentHtml(draft) {
  const marginInches = draft.styling.pageMargin || 1;
  const marginMm = marginInches * 25.4;

  const blocksHtml = draft.blocks
    .map((block, index) => {
      const prevType = index > 0 ? draft.blocks[index - 1].type : null;
      return renderBlockHtml(block, prevType, draft.styling);
    })
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(draft.title || "Draft")}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: white;
          }

          body {
            font-family: ${draft.styling.fontFamily};
            font-size: ${draft.styling.fontSize}px;
            color: #0f172a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .draft-page {
            box-sizing: border-box;
            width: 210mm;
            min-height: 297mm;
            padding: ${marginMm}mm;
            background: white;
          }

          @media screen {
            body {
              background: #f1f5f9;
              padding: 16px;
            }

            .draft-page {
              margin: 0 auto;
              box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
            }
          }

          @media print {
            html, body {
              background: white;
            }

            .draft-page {
              margin: 0;
              box-shadow: none;
              break-after: avoid-page;
            }
          }
        </style>
      </head>
      <body>
        <div class="draft-page">
          ${blocksHtml}
        </div>
      </body>
    </html>
  `;
}
