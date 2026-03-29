import { createDraftModel } from "../models/draftModel";
import { createDraftTitle } from "../utils/createDraftTitle";
import { createDraftBlock } from "../models/blockModel";
import { createOfficeProfileModel } from "../models/officeProfileModel";
import { BLOCK_TYPES } from "../constants/blockTypes";

function generateId(prefix = "draft") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function joinIncludedLines(items) {
  return items
    .filter((item) => item.include && item.value?.trim())
    .map((item) => item.value.trim())
    .join("\n");
}

function buildInitialContent(type, profile, template) {
  if (type === BLOCK_TYPES.GOVERNMENT_IDENTITY) {
    return joinIncludedLines([
      { include: profile.includeGovtLineEn, value: profile.govtLineEn },
      { include: profile.includeGovtLineHi, value: profile.govtLineHi },
    ]);
  }

  if (type === BLOCK_TYPES.DEPARTMENT_IDENTITY) {
    return joinIncludedLines([
      { include: profile.includeDepartmentEn, value: profile.departmentEn },
      { include: profile.includeDepartmentHi, value: profile.departmentHi },
    ]);
  }

  if (type === BLOCK_TYPES.PLACE_DATE_LINE) {
    return {
      place: profile.includeCity ? profile.city || "" : "",
      date: formatCurrentDate(),
    };
  }

  // sender / signatory family
  if (type === BLOCK_TYPES.SENDER_NAME_BLOCK) {
    return profile.includeSignatoryName ? profile.defaultSignatoryName : "";
  }

  if (type === BLOCK_TYPES.SENDER_DESIGNATION_BLOCK) {
    return profile.includeSignatoryDesignation
      ? profile.defaultSignatoryDesignation
      : "";
  }

  if (type === BLOCK_TYPES.SIGNATURE_BLOCK) {
    return profile.includeSignatoryName ? profile.defaultSignatoryName : "";
  }

  if (type === BLOCK_TYPES.DESIGNATION_CONTACT_BLOCK) {
    return joinIncludedLines([
      {
        include: profile.includeSignatoryDesignation,
        value: profile.defaultSignatoryDesignation,
      },
      { include: profile.includePhone, value: profile.defaultPhone },
      { include: profile.includeEmail, value: profile.defaultEmail },
    ]);
  }

  if (type === BLOCK_TYPES.CONTACT_LINE) {
    return joinIncludedLines([
      { include: profile.includePhone, value: profile.defaultPhone },
      { include: profile.includeEmail, value: profile.defaultEmail },
    ]);
  }

  if (template.blockOverrides?.[type]) {
    return template.blockOverrides[type];
  }

  return "";
}

function buildBlocksFromTemplate(template, officeProfile = {}) {
  const profile = createOfficeProfileModel(officeProfile);

  return template.blockSequence.map((type, index) =>
    createDraftBlock({
      type,
      content: buildInitialContent(type, profile, template),
      order: index,
    }),
  );
}

export function createDraftFromTemplate(
  template,
  preferences = {},
  officeProfile = {},
) {
  if (!template) {
    throw new Error("Template is required to create a draft.");
  }

  const now = new Date().toISOString();

  return createDraftModel({
    id: generateId("draft"),
    title: createDraftTitle(template.type),
    type: template.type,
    templateId: template.id,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    blocks: buildBlocksFromTemplate(template, officeProfile),
    officeProfile,
    styling: preferences,
  });
}

export function createBlankDraft(preferences = {}, officeProfile = {}) {
  const now = new Date().toISOString();

  return createDraftModel({
    id: generateId("draft"),
    title: "Blank Draft",
    type: "blank",
    templateId: null,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    blocks: [
      createDraftBlock({
        type: BLOCK_TYPES.BODY_PARAGRAPH,
        content: "",
        order: 0,
      }),
    ],
    officeProfile,
    styling: preferences,
  });
}
