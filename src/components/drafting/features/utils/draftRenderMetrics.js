export function getDraftBlockText(block) {
  if (block.type === "subject_block") {
    return `Subject: ${block.content || block.placeholder || ""}`;
  }

  if (block.type === "place_date_line") {
    const place = block.content?.place || "";
    const date = block.content?.date || "";
    return `${place}\nDated ${date}`;
  }

  return block.content || block.placeholder || "";
}

export function getDraftBlockClass(type, underlineCommunicationLabel = true) {
  switch (type) {
    case "document_number":
    case "do_number":
    case "government_identity":
    case "department_identity":
      return "text-center";

    case "place_date_line":
      return "text-right";

    case "communication_label":
      return underlineCommunicationLabel
        ? "text-center font-semibold uppercase underline underline-offset-4"
        : "text-center font-semibold uppercase";

    case "subject_block":
      return "text-justify font-bold";

    case "body_paragraph":
    case "intro_phrase_block":
      return "text-justify";

    case "signoff_block":
    case "complimentary_close":
    case "signature_block":
    case "designation_contact_block":
      return "text-right";

    default:
      return "";
  }
}

export function getDraftBlockSpacing(block, prevType, styling) {
  if (!prevType) return 0;

  if (prevType === "document_number" && block.type === "government_identity") {
    return 2;
  }

  if (
    prevType === "government_identity" &&
    block.type === "department_identity"
  ) {
    return 2;
  }

  if (prevType === "department_identity" && block.type === "place_date_line") {
    return 10;
  }

  if (prevType === "body_paragraph" || prevType === "intro_phrase_block") {
    if (
      block.type === "signoff_block" ||
      block.type === "complimentary_close" ||
      block.type === "signature_block" ||
      block.type === "designation_contact_block"
    ) {
      return styling.signatureGap || 28;
    }

    return styling.bodyParagraphSpacing || 8;
  }

  if (
    prevType === "signature_block" &&
    block.type === "designation_contact_block"
  ) {
    return 0;
  }

  if (prevType === "communication_label") return 12;

  if (
    prevType === "subject_block" &&
    (block.type === "body_paragraph" || block.type === "intro_phrase_block")
  ) {
    return styling.bodyParagraphSpacing || 8;
  }

  return styling.paragraphSpacing || 4;
}

export function getDraftBlockStyle(block, styling) {
  const isBody =
    block.type === "body_paragraph" || block.type === "intro_phrase_block";

  return {
    lineHeight:
      block.type === "government_identity" ||
      block.type === "department_identity" ||
      block.type === "document_number" ||
      block.type === "do_number"
        ? styling.lineSpacing || 1
        : block.type === "body_paragraph" ||
            block.type === "intro_phrase_block" ||
            block.type === "subject_block"
          ? styling.bodyLineSpacing || 1.15
          : styling.lineSpacing || 1,
    fontWeight:
      block.type === "document_number" ||
      block.type === "government_identity" ||
      block.type === "department_identity"
        ? 500
        : undefined,
    textIndent: isBody ? `${styling.bodyFirstLineIndent || 0.5}in` : 0,
  };
}
