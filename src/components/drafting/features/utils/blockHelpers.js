// import { BLOCK_RULES } from "../constants/blockRules";
// import { BLOCK_ZONES } from "../constants/blockZones";
// import { createDraftBlock } from "../models/blockModel";

// export function createBlock(type, content = "", meta = {}) {
//   return createDraftBlock({ type, content, meta });
// }

// export function normalizeBlockOrders(blocks = []) {
//   return blocks.map((block, index) => ({
//     ...block,
//     order: index,
//   }));
// }

// export function groupBlocksByZone(blocks = []) {
//   return {
//     [BLOCK_ZONES.HEADER]: blocks.filter((b) => b.zone === BLOCK_ZONES.HEADER),
//     [BLOCK_ZONES.ADDRESSING]: blocks.filter(
//       (b) => b.zone === BLOCK_ZONES.ADDRESSING,
//     ),
//     [BLOCK_ZONES.BODY]: blocks.filter((b) => b.zone === BLOCK_ZONES.BODY),
//     [BLOCK_ZONES.CLOSING]: blocks.filter((b) => b.zone === BLOCK_ZONES.CLOSING),
//     [BLOCK_ZONES.ROUTING]: blocks.filter((b) => b.zone === BLOCK_ZONES.ROUTING),
//   };
// }

// export function canDeleteBlock(blocks, blockId) {
//   const target = blocks.find((b) => b.id === blockId);
//   if (!target) return false;
//   if (!target.isRemovable) return false;

//   const sameTypeCount = blocks.filter((b) => b.type === target.type).length;
//   if (target.isRequired && sameTypeCount <= 1) return false;

//   return true;
// }

// export function getInsertableBlockTypes(existingBlocks = []) {
//   const existingTypes = new Set(existingBlocks.map((b) => b.type));

//   return Object.entries(BLOCK_RULES)
//     .filter(([, rule]) => {
//       if (rule.isRepeatable) return true;
//       return !existingTypes.has(
//         Object.keys(BLOCK_RULES).find((key) => BLOCK_RULES[key] === rule),
//       );
//     })
//     .map(([type, rule]) => ({
//       type,
//       label: rule.label,
//       zone: rule.zone,
//     }));
// }

import { BLOCK_RULES } from "../constants/blockRules";
import { BLOCK_ZONES } from "../constants/blockZones";
import { BLOCK_TYPES } from "../constants/blockTypes";
import { createDraftBlock } from "../models/blockModel";
import { getSelectedSignatoryProfile } from "../models/officeProfileModel";

function joinIncludedLines(items) {
  return items
    .filter((item) => item.include && item.value?.trim())
    .map((item) => item.value.trim())
    .join("\n");
}

function formatCurrentDateForIdNote() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDefaultDepartmentName(officeProfile = {}) {
  if (
    officeProfile.includeDepartmentEn &&
    String(officeProfile.departmentEn || "").trim()
  ) {
    return String(officeProfile.departmentEn).trim();
  }

  if (
    officeProfile.includeGovtLineEn &&
    String(officeProfile.govtLineEn || "").trim()
  ) {
    return String(officeProfile.govtLineEn).trim();
  }

  return "Department of ...";
}

function getExistingIdNoPart(value = "") {
  const existing = String(value || "").trim();
  const idMatch = existing.match(/I\.D\.\s*No\.\s*(.*?)(?:\s+dated\s+.*)?$/i);
  return idMatch?.[1]?.trim() || "...";
}

export function hydrateBlockContentFromOfficeProfile(
  block,
  officeProfile = {},
) {
  const selectedSignatory = getSelectedSignatoryProfile(officeProfile);

  if (block.type === BLOCK_TYPES.GOVERNMENT_IDENTITY) {
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

  if (block.type === BLOCK_TYPES.DEPARTMENT_IDENTITY) {
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

  if (block.type === BLOCK_TYPES.PLACE_DATE_LINE) {
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

  if (block.type === BLOCK_TYPES.SENDER_NAME_BLOCK) {
    return {
      ...block,
      content: officeProfile.includeSignatoryName ? selectedSignatory.name : "",
    };
  }

  if (block.type === BLOCK_TYPES.SENDER_DESIGNATION_BLOCK) {
    return {
      ...block,
      content: officeProfile.includeSignatoryDesignation
        ? selectedSignatory.designation
        : "",
    };
  }

  if (block.type === BLOCK_TYPES.SIGNATURE_BLOCK) {
    return {
      ...block,
      content: officeProfile.includeSignatoryName ? selectedSignatory.name : "",
    };
  }

  if (block.type === BLOCK_TYPES.DESIGNATION_CONTACT_BLOCK) {
    return {
      ...block,
      content: joinIncludedLines([
        {
          include: officeProfile.includeSignatoryDesignation,
          value: selectedSignatory.designation,
        },
        {
          include: officeProfile.includePhone,
          value: selectedSignatory.phone,
        },
        {
          include: officeProfile.includeEmail,
          value: selectedSignatory.email,
        },
      ]),
    };
  }

  if (block.type === BLOCK_TYPES.CONTACT_LINE) {
    return {
      ...block,
      content: joinIncludedLines([
        {
          include: officeProfile.includePhone,
          value: selectedSignatory.phone,
        },
        {
          include: officeProfile.includeEmail,
          value: selectedSignatory.email,
        },
      ]),
    };
  }

  if (block.type === BLOCK_TYPES.ID_NOTE_FOOTER) {
    const departmentName = getDefaultDepartmentName(officeProfile);
    const idNoPart = getExistingIdNoPart(
      block.content || block.placeholder || "",
    );
    const currentDate = formatCurrentDateForIdNote();

    return {
      ...block,
      content: `${departmentName} I.D. No. ${idNoPart} dated ${currentDate}`,
    };
  }

  return block;
}

export function hydrateBlocksWithOfficeProfile(
  blocks = [],
  officeProfile = {},
) {
  return blocks.map((block) =>
    hydrateBlockContentFromOfficeProfile(block, officeProfile),
  );
}
function getDefaultBlockContent(type, content, meta = {}) {
  if (content !== undefined && content !== null) {
    return content;
  }

  if (type === BLOCK_TYPES.BODY_TABLE) {
    return {
      title: "",
      hasHeaderRow: true,
      rows: [
        ["Column 1", "Column 2", "Column 3"],
        ["", "", ""],
        ["", "", ""],
      ],
    };
  }

  if (type === BLOCK_TYPES.ID_NOTE_FOOTER) {
    const departmentName = getDefaultDepartmentName(meta);
    const currentDate = formatCurrentDateForIdNote();
    return `${departmentName} I.D. No. ... dated ${currentDate}`;
  }

  return "";
}

export function createBlock(type, content, meta = {}) {
  const block = createDraftBlock({
    type,
    content: getDefaultBlockContent(type, content, meta),
    meta,
  });

  return hydrateBlockContentFromOfficeProfile(block, meta?.officeProfile || {});
}

export function normalizeBlockOrders(blocks = []) {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }));
}

export function groupBlocksByZone(blocks = []) {
  return {
    [BLOCK_ZONES.HEADER]: blocks.filter((b) => b.zone === BLOCK_ZONES.HEADER),
    [BLOCK_ZONES.ADDRESSING]: blocks.filter(
      (b) => b.zone === BLOCK_ZONES.ADDRESSING,
    ),
    [BLOCK_ZONES.BODY]: blocks.filter((b) => b.zone === BLOCK_ZONES.BODY),
    [BLOCK_ZONES.CLOSING]: blocks.filter((b) => b.zone === BLOCK_ZONES.CLOSING),
    [BLOCK_ZONES.ROUTING]: blocks.filter((b) => b.zone === BLOCK_ZONES.ROUTING),
  };
}

export function canDeleteBlock(blocks, blockId) {
  const target = blocks.find((b) => b.id === blockId);
  if (!target) return false;
  if (!target.isRemovable) return false;

  const sameTypeCount = blocks.filter((b) => b.type === target.type).length;
  if (target.isRequired && sameTypeCount <= 1) return false;

  return true;
}

export function getInsertableBlockTypes(existingBlocks = []) {
  const existingTypes = new Set(existingBlocks.map((b) => b.type));

  return Object.entries(BLOCK_RULES)
    .filter(([type, rule]) => {
      if (type === BLOCK_TYPES.BODY_TABLE) return true;
      if (rule.isRepeatable) return true;
      return !existingTypes.has(type);
    })
    .map(([type, rule]) => ({
      type,
      label: rule.label,
      zone: rule.zone,
    }));
}
