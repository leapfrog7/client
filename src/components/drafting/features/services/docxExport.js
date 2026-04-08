import {
  AlignmentType,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  TextRun,
  UnderlineType,
  convertInchesToTwip,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

const A4_PAGE_WIDTH_TWIP = 11906;
const A4_PAGE_HEIGHT_TWIP = 16838;

function splitLinesPreserveMeaning(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""));
}

function parseInlineHtmlToRuns(html, styling, options = {}) {
  const { forceBold = false } = options;
  const container = document.createElement("div");
  container.innerHTML = String(html || "");

  const runs = [];

  const walk = (
    node,
    marks = { bold: false, italic: false, underline: false },
  ) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || "";
        if (text) {
          runs.push(
            new TextRun({
              text,
              bold: forceBold || marks.bold,
              italics: marks.italic,
              underline: marks.underline
                ? { type: UnderlineType.SINGLE }
                : undefined,
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          );
        }
        return;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();

        if (tag === "br") {
          runs.push(
            new TextRun({
              break: 1,
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          );
          return;
        }

        const nextMarks = {
          bold: marks.bold || tag === "b" || tag === "strong",
          italic: marks.italic || tag === "i" || tag === "em",
          underline: marks.underline || tag === "u",
        };

        walk(child, nextMarks);

        if (tag === "div" || tag === "p") {
          runs.push(
            new TextRun({
              break: 1,
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          );
        }
      }
    });
  };

  walk(container);

  return runs.length
    ? runs
    : [
        new TextRun({
          text: "",
          font: styling.fontFamily,
          size: styling.fontSize * 2,
        }),
      ];
}

function parseRichHtmlToParagraphs(html, styling) {
  const container = document.createElement("div");
  container.innerHTML = String(html || "");

  const paragraphs = [];
  let currentRuns = [];

  const pushParagraph = (forceEmpty = false) => {
    if (!currentRuns.length) {
      if (forceEmpty) {
        paragraphs.push([
          new TextRun({
            text: "",
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
        ]);
      }
      return;
    }

    paragraphs.push(currentRuns);
    currentRuns = [];
  };

  const walk = (
    node,
    marks = { bold: false, italic: false, underline: false },
  ) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || "";
        if (text) {
          currentRuns.push(
            new TextRun({
              text,
              bold: marks.bold,
              italics: marks.italic,
              underline: marks.underline
                ? { type: UnderlineType.SINGLE }
                : undefined,
              font: styling.fontFamily,
              size: styling.fontSize * 2,
            }),
          );
        }
        return;
      }

      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();

        if (tag === "br") {
          pushParagraph(true);
          return;
        }

        const nextMarks = {
          bold: marks.bold || tag === "b" || tag === "strong",
          italic: marks.italic || tag === "i" || tag === "em",
          underline: marks.underline || tag === "u",
        };

        if (tag === "div" || tag === "p") {
          const isEmptyBlock =
            child.innerHTML === "<br>" ||
            child.innerHTML === "" ||
            child.textContent === "";

          if (isEmptyBlock) {
            paragraphs.push([
              new TextRun({
                text: "",
                font: styling.fontFamily,
                size: styling.fontSize * 2,
              }),
            ]);
          } else {
            walk(child, nextMarks);
            pushParagraph(false);
          }
        } else {
          walk(child, nextMarks);
        }
      }
    });
  };

  walk(container);

  if (currentRuns.length) {
    pushParagraph(false);
  }

  return paragraphs.length
    ? paragraphs
    : [
        [
          new TextRun({
            text: "",
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
        ],
      ];
}

function isRichTextBlock(type) {
  return (
    type === "subject_block" ||
    type === "body_paragraph" ||
    type === "intro_phrase_block"
  );
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

function buildDocxTable(block, prevType, styling) {
  const rows = Array.isArray(block.content?.rows) ? block.content.rows : [];
  const hasHeaderRow = block.content?.hasHeaderRow ?? true;
  const title = block.content?.title || "";

  const beforeSpacing = getSpacingBefore(block, prevType, styling);

  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: rows.map(
      (row, rowIndex) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: String(cell ?? ""),
                        bold: hasHeaderRow && rowIndex === 0,
                        font: styling.fontFamily,
                        size: styling.fontSize * 2,
                      }),
                    ],
                  }),
                ],
              }),
          ),
        }),
    ),
  });

  const output = [];

  if (title) {
    output.push(
      new Paragraph({
        spacing: { before: beforeSpacing, after: 120 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
        ],
      }),
    );
  } else {
    output.push(
      new Paragraph({
        spacing: { before: beforeSpacing, after: 0 },
        children: [new TextRun({ text: "" })],
      }),
    );
  }

  output.push(table);
  return output;
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

function makeParagraphsForBlock(block, prevType, styling) {
  if (block.type === "body_table") {
    return buildDocxTable(block, prevType, styling);
  }

  const text = getBlockText(block);
  const alignment = getAlignment(block.type);
  const beforeSpacing = getSpacingBefore(block, prevType, styling);
  const lineSpacing = getLineSpacing(block.type, styling);

  const commonSpacing = {
    before: beforeSpacing,
    after: 0,
    line: lineSpacing,
  };

  if (block.type === "subject_block") {
    const richRuns = isRichTextBlock(block.type)
      ? parseInlineHtmlToRuns(block.content || "", styling, { forceBold: true })
      : [
          new TextRun({
            text: typeof text === "string" ? text : "",
            bold: true,
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
        ];

    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "Subject: ",
            bold: true,
            font: styling.fontFamily,
            size: styling.fontSize * 2,
          }),
          ...richRuns,
        ],
        alignment,
        spacing: commonSpacing,
      }),
    ];
  }

  if (block.type === "body_paragraph" || block.type === "intro_phrase_block") {
    const rawHtml = typeof block.content === "string" ? block.content : "";

    if (!rawHtml.trim()) {
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
        }),
      ];
    }

    const paragraphRuns = parseRichHtmlToParagraphs(rawHtml, styling);

    return paragraphRuns.map(
      (runs, index) =>
        new Paragraph({
          children: runs,
          alignment,
          spacing: {
            before: index === 0 ? beforeSpacing : 0,
            after: 0,
            line: lineSpacing,
          },
        }),
    );
  }

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

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: typeof text === "string" ? text : "",
          bold: block.type === "communication_label",
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
