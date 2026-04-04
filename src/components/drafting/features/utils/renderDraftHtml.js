import { getDraftBlockText, getDraftBlockHtml } from "./draftRenderMetrics";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function supportsRichText(type) {
  return (
    type === "subject_block" ||
    type === "body_paragraph" ||
    type === "intro_phrase_block"
  );
}

function getPrintBlockSpacing(block, prevType, styling) {
  if (!prevType) return 0;

  if (prevType === "document_number" && block.type === "government_identity") {
    return 0;
  }

  if (
    prevType === "government_identity" &&
    block.type === "department_identity"
  ) {
    return 0;
  }

  if (prevType === "department_identity" && block.type === "place_date_line") {
    return 6;
  }

  if (
    prevType === "body_paragraph" ||
    prevType === "intro_phrase_block" ||
    prevType === "body_table"
  ) {
    if (
      block.type === "signoff_block" ||
      block.type === "complimentary_close" ||
      block.type === "signature_block" ||
      block.type === "designation_contact_block"
    ) {
      return Math.max(10, Math.round((styling.signatureGap || 28) * 0.45));
    }

    return Math.max(3, Math.round((styling.bodyParagraphSpacing || 8) * 0.45));
  }

  if (
    prevType === "signature_block" &&
    block.type === "designation_contact_block"
  ) {
    return 0;
  }

  if (prevType === "communication_label") return 6;

  if (
    prevType === "subject_block" &&
    (block.type === "body_paragraph" ||
      block.type === "intro_phrase_block" ||
      block.type === "body_table")
  ) {
    return Math.max(3, Math.round((styling.bodyParagraphSpacing || 8) * 0.45));
  }

  return Math.max(2, Math.round((styling.paragraphSpacing || 4) * 0.5));
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

function getBlockTextIndent() {
  return "0";
}

function renderTableBlock(block, prevType, styling) {
  const title = block.content?.title || "";
  const rows = block.content?.rows || [];

  const tableRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell) => {
          const tag = rowIndex === 0 ? "th" : "td";
          return `<${tag}
            style="
              border:1px solid #cbd5e1;
              padding:8px 10px;
              text-align:left;
              vertical-align:top;
              ${tag === "th" ? "font-weight:600;background:#f8fafc;" : ""}
            "
          >${escapeHtml(cell)}</${tag}>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div
      style="
        margin-top:${getPrintBlockSpacing(block, prevType, styling)}px;
      "
    >
      ${
        title
          ? `<div style="margin-bottom:4px;font-weight:600;line-height:${styling.lineSpacing || 1};">${escapeHtml(title)}</div>`
          : ""
      }
      <table
        style="
          width:100%;
          border-collapse:collapse;
          table-layout:fixed;
          font-size:inherit;
          line-height:inherit;
        "
      >
        ${tableRows}
      </table>
    </div>
  `;
}

function renderRichBlockHtml(block, prevType, styling) {
  const richHtml = getDraftBlockHtml(block) || "";
  const alignment = getBlockAlignment(block.type);

  if (block.type === "subject_block") {
    return `
      <div
        style="
          margin-top:${getPrintBlockSpacing(block, prevType, styling)}px;
          text-align:${alignment};
          line-height:${getBlockLineHeight(block.type, styling)};
          font-weight:${getBlockFontWeight(block.type)};
          text-indent:0;
          word-break:break-word;
        "
      >
        <div style="display:flex;align-items:flex-start;gap:8px;justify-content:flex-start;">
          <span style="font-weight:700;">Subject:</span>
          <div style="flex:1;">${richHtml}</div>
        </div>
      </div>
    `;
  }

  return `
    <div
      style="
        margin-top:${getPrintBlockSpacing(block, prevType, styling)}px;
        text-align:${alignment};
        line-height:${getBlockLineHeight(block.type, styling)};
        font-weight:${getBlockFontWeight(block.type)};
        text-decoration:${getBlockTextDecoration(block.type, styling)};
        text-transform:${getBlockTextTransform(block.type)};
        text-indent:${getBlockTextIndent(block.type, styling)};
        word-break:break-word;
      "
    >
      ${richHtml}
    </div>
  `;
}

function renderBlockHtml(block, prevType, styling) {
  if (block.type === "body_table") {
    return renderTableBlock(block, prevType, styling);
  }

  if (supportsRichText(block.type)) {
    return renderRichBlockHtml(block, prevType, styling);
  }

  const text = getDraftBlockText(block);

  return `
    <div
      style="
        margin-top:${getPrintBlockSpacing(block, prevType, styling)}px;
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
            font-size: ${(draft.styling.fontSize || 12) * 1.333333}px;
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

          .draft-page div,
          .draft-page p,
          .draft-page table {
            margin-top: 0;
            margin-bottom: 0;
          }

          .draft-page table {
            margin: 0;
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
