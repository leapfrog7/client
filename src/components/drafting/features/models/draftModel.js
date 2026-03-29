import { DEFAULT_PREFERENCES } from "../constants/defaultPreferences";
import { TEMPLATE_TYPES } from "../constants/templateTypes";
import { createOfficeProfileModel } from "./officeProfileModel";

export function createDraftModel({
  id,
  title = "Untitled Draft",
  type = TEMPLATE_TYPES.BLANK,
  templateId = null,
  status = "draft",
  blocks = [],
  officeProfile = {},
  styling = {},
  flags = {},
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
  lastOpenedAt = new Date().toISOString(),
}) {
  return {
    id,
    title,
    type,
    templateId,
    status,
    createdAt,
    updatedAt,
    lastOpenedAt,
    blocks,
    officeProfile: createOfficeProfileModel(officeProfile),
    styling: {
      fontFamily: DEFAULT_PREFERENCES.fontFamily,
      fontSize: DEFAULT_PREFERENCES.fontSize,
      lineSpacing: DEFAULT_PREFERENCES.lineSpacing,
      paragraphSpacing: DEFAULT_PREFERENCES.paragraphSpacing,
      ...styling,
    },
    flags: {
      pinned: false,
      archived: false,
      ...flags,
    },
  };
}
