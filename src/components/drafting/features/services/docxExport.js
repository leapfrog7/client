import {
  AlignmentType,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  TextRun,
  UnderlineType,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";

const A4_PAGE_WIDTH_TWIP = 11906;
const A4_PAGE_HEIGHT_TWIP = 16838;

function splitNonEmptyParagraphs(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitLinesPreserveMeaning(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""));
}

function getBlockText(block) {
  if (block.type === "subject_block") {
    return block.content || block.placeholder || "";
  }

  if (block.type === "place_date_line") {
    const place = block.content?.place || "";
    const date = block.content?.date || "";
    return { place, date };
  }

  return block.content || block.placeholder || "";
}

function getAlignment(type) {
  if (
    type === "document_number" ||
    type === "do_number" ||
    type === "government_identity" ||
    type === "department_identity" ||
    type === "communication_label"
  ) {
    return AlignmentType.CENTER;
  }

  if (
    type === "place_date_line" ||
    type === "signoff_block" ||
    type === "complimentary_close" ||
    type === "signature_block" ||
    type === "designation_contact_block"
  ) {
    return AlignmentType.RIGHT;
  }

  if (
    type === "subject_block" ||
    type === "body_paragraph" ||
    type === "intro_phrase_block"
  ) {
    return AlignmentType.JUSTIFIED;
  }

  return AlignmentType.LEFT;
}

function getLineSpacing(blockType, styling) {
  const multiplier =
    blockType === "government_identity" ||
    blockType === "department_identity" ||
    blockType === "document_number" ||
    blockType === "do_number"
      ? styling.lineSpacing || 1.05
      : blockType === "body_paragraph" ||
          blockType === "intro_phrase_block" ||
          blockType === "subject_block"
        ? styling.bodyLineSpacing || 1.15
        : styling.lineSpacing || 1;

  return Math.round(multiplier * 240);
}

function getSpacingBefore(block, prevType, styling) {
  if (!prevType) return 0;

  if (prevType === "document_number" && block.type === "government_identity") {
    return 40;
  }

  if (
    prevType === "government_identity" &&
    block.type === "department_identity"
  ) {
    return 40;
  }

  if (prevType === "department_identity" && block.type === "place_date_line") {
    return 120;
  }

  if (prevType === "body_paragraph" || prevType === "intro_phrase_block") {
    if (
      block.type === "signoff_block" ||
      block.type === "complimentary_close" ||
      block.type === "signature_block" ||
      block.type === "designation_contact_block"
    ) {
      return Math.round((styling.signatureGap || 28) * 0.75 * 20);
    }

    return Math.round((styling.bodyParagraphSpacing || 8) * 0.75 * 20);
  }

  if (
    prevType === "signature_block" &&
    block.type === "designation_contact_block"
  ) {
    return 0;
  }

  if (prevType === "communication_label") return 180;

  if (
    prevType === "subject_block" &&
    (block.type === "body_paragraph" || block.type === "intro_phrase_block")
  ) {
    return Math.round((styling.bodyParagraphSpacing || 8) * 0.75 * 20);
  }

  return Math.round((styling.paragraphSpacing || 4) * 0.75 * 20);
}

// function makeTextRunsForBlock(block, styling) {
//   if (block.type === "subject_block") {
//     return [
//       new TextRun({
//         text: "Subject: ",
//         bold: true,
//         font: styling.fontFamily,
//         size: styling.fontSize * 2,
//       }),
//       new TextRun({
//         text: block.content || "",
//         bold: true,
//         font: styling.fontFamily,
//         size: styling.fontSize * 2,
//       }),
//     ];
//   }

//   if (block.type === "communication_label") {
//     return [
//       new TextRun({
//         text: String(block.content || "").toUpperCase(),
//         bold: true,
//         underline: styling.underlineCommunicationLabel
//           ? { type: UnderlineType.SINGLE }
//           : undefined,
//         font: styling.fontFamily,
//         size: styling.fontSize * 2,
//       }),
//     ];
//   }

//   const text = typeof block.content === "string" ? block.content : "";

//   return [
//     new TextRun({
//       text,
//       bold:
//         block.type === "document_number" ||
//         block.type === "government_identity" ||
//         block.type === "department_identity",
//       font: styling.fontFamily,
//       size: styling.fontSize * 2,
//     }),
//   ];
// }

function makeParagraphsForBlock(block, prevType, styling) {
  const text = getBlockText(block);
  const alignment = getAlignment(block.type);
  const beforeSpacing = getSpacingBefore(block, prevType, styling);
  const lineSpacing = getLineSpacing(block.type, styling);

  const commonSpacing = {
    before: beforeSpacing,
    after: 0,
    line: lineSpacing,
  };

  const bodyIndent = {
    firstLine: convertInchesToTwip(styling.bodyFirstLineIndent || 0.5),
  };

  // Subject
  if (block.type === "subject_block") {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "Subject: ",
            bold: true,
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
          new TextRun({
            text: text,
            bold: true,
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
        ],
        alignment,
        spacing: commonSpacing,
      }),
    ];
  }

  // Body blocks: preserve separate paras inside one block
  if (block.type === "body_paragraph" || block.type === "intro_phrase_block") {
    const paras = splitNonEmptyParagraphs(text);

    if (!paras.length) {
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: "",
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          ],
          alignment,
          spacing: commonSpacing,
          indent: bodyIndent,
        }),
      ];
    }

    return paras.map(
      (para, index) =>
        new Paragraph({
          children: [
            new TextRun({
              text: para,
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          ],
          alignment,
          spacing: {
            before:
              index === 0 ? beforeSpacing : styling.bodyParagraphSpacing || 8,
            after: 0,
            line: lineSpacing,
          },
          indent: bodyIndent,
        }),
    );
  }

  // Addressee and Copy To: preserve heading and numbered items as separate paragraphs
  if (block.type === "to_block" || block.type === "copy_to_block") {
    const lines = splitLinesPreserveMeaning(text).filter(
      (line) => line.trim() !== "",
    );

    if (!lines.length) return [];

    return lines.map((line, index) => {
      const isHeading =
        line.trim().toLowerCase() === "to" ||
        line.trim().toLowerCase() === "copy to";

      return new Paragraph({
        children: [
          new TextRun({
            text: line.trimStart(),
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
          before: index === 0 ? beforeSpacing : 0,
          after: 0,
          line: lineSpacing,
        },
        indent: isHeading
          ? undefined
          : {
              left: convertInchesToTwip(0.35),
            },
      });
    });
  }

  // Designation/contact block: preserve line-by-line structure
  if (block.type === "designation_contact_block") {
    const lines = splitLinesPreserveMeaning(text).filter(
      (line) => line.trim() !== "",
    );

    if (!lines.length) return [];

    return lines.map(
      (line, index) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          ],
          alignment,
          spacing: {
            before: index === 0 ? beforeSpacing : 0,
            after: 0,
            line: lineSpacing,
          },
        }),
    );
  }

  // Generic single paragraph block
  return [
    new Paragraph({
      children: [
        new TextRun({
          text,
          bold:
            block.type === "document_number" ||
            block.type === "government_identity" ||
            block.type === "department_identity" ||
            block.type === "communication_label",
          underline:
            block.type === "communication_label" &&
            styling.underlineCommunicationLabel
              ? { type: UnderlineType.SINGLE }
              : undefined,
          font: styling.fontFamily,
          size: styling.fontSize * 2,
        }),
      ],
      alignment,
      spacing: commonSpacing,
    }),
  ];
}

function makeParagraphsForPlaceDate(block, prevType, styling) {
  const { place, date } = getBlockText(block);

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: place || "",
          font: styling.fontFamily,
          size: styling.fontSize * 2,
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: {
        before: getSpacingBefore(block, prevType, styling),
        after: 0,
        line: getLineSpacing(block.type, styling),
      },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Dated ",
          font: styling.fontFamily,
          size: styling.fontSize * 2,
        }),
        new TextRun({
          text: date || "",
          font: styling.fontFamily,
          size: styling.fontSize * 2,
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: {
        before: 0,
        after: 0,
        line: getLineSpacing(block.type, styling),
      },
    }),
  ];
}

function buildDocParagraphs(draft) {
  const paragraphs = [];

  draft.blocks.forEach((block, index) => {
    const prevType = index > 0 ? draft.blocks[index - 1].type : null;

    if (block.type === "place_date_line") {
      paragraphs.push(
        ...makeParagraphsForPlaceDate(block, prevType, draft.styling),
      );
      return;
    }

    paragraphs.push(...makeParagraphsForBlock(block, prevType, draft.styling));
  });

  return paragraphs;
}

export async function exportDraftToDocx(draft) {
  const marginInches = draft.styling.pageMargin || 1;
  const marginTwip = convertInchesToTwip(marginInches);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: A4_PAGE_WIDTH_TWIP,
              height: A4_PAGE_HEIGHT_TWIP,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: marginTwip,
              right: marginTwip,
              bottom: marginTwip,
              left: marginTwip,
            },
          },
        },
        children: buildDocParagraphs(draft),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = (draft.title || "draft")
    .replace(/[<>:"/\\|?*]/g, "")
    .trim();

  saveAs(blob, `${safeTitle || "draft"}.docx`);
}
