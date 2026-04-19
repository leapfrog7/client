import { BLOCK_TYPES } from "./blockTypes";
import { BLOCK_ZONES } from "./blockZones";
import { BLOCK_LABELS } from "./blockLabels";

export const BLOCK_RULES = {
  [BLOCK_TYPES.PUBLICATION_NOTE]: {
    label: BLOCK_LABELS[BLOCK_TYPES.PUBLICATION_NOTE],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "[To be published in the Gazette of India ...]",
  },

  [BLOCK_TYPES.DOCUMENT_NUMBER]: {
    label: BLOCK_LABELS[BLOCK_TYPES.DOCUMENT_NUMBER],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "No. ...",
  },

  [BLOCK_TYPES.DO_NUMBER]: {
    label: BLOCK_LABELS[BLOCK_TYPES.DO_NUMBER],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "D.O. No. ...",
  },

  [BLOCK_TYPES.GOVERNMENT_IDENTITY]: {
    label: BLOCK_LABELS[BLOCK_TYPES.GOVERNMENT_IDENTITY],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "Government of India\n(Bharat Sarkar)",
  },

  [BLOCK_TYPES.DEPARTMENT_IDENTITY]: {
    label: BLOCK_LABELS[BLOCK_TYPES.DEPARTMENT_IDENTITY],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "Department of ...\n(... Vibhag)",
  },

  [BLOCK_TYPES.PLACE_DATE_LINE]: {
    label: BLOCK_LABELS[BLOCK_TYPES.PLACE_DATE_LINE],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "New Delhi, the ... 20..",
  },

  [BLOCK_TYPES.COMMUNICATION_LABEL]: {
    label: BLOCK_LABELS[BLOCK_TYPES.COMMUNICATION_LABEL],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "OFFICE MEMORANDUM",
  },

  [BLOCK_TYPES.TO_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.TO_BLOCK],
    zone: BLOCK_ZONES.ADDRESSING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "To\n    1. ...\n    2. ...",
  },

  [BLOCK_TYPES.SUBJECT_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.SUBJECT_BLOCK],
    zone: BLOCK_ZONES.ADDRESSING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Enter subject...",
  },

  [BLOCK_TYPES.SALUTATION_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.SALUTATION_BLOCK],
    zone: BLOCK_ZONES.ADDRESSING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Sir/Madam,",
  },

  [BLOCK_TYPES.INTRO_PHRASE_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.INTRO_PHRASE_BLOCK],
    zone: BLOCK_ZONES.BODY,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Enter body text...",
  },

  [BLOCK_TYPES.BODY_PARAGRAPH]: {
    label: BLOCK_LABELS[BLOCK_TYPES.BODY_PARAGRAPH],
    zone: BLOCK_ZONES.BODY,
    isRequired: false,
    isRemovable: true,
    isRepeatable: true,
    isLockedPosition: false,
    placeholder: "Enter body paragraph...",
  },

  [BLOCK_TYPES.BODY_TABLE]: {
    label: "Table",
    zone: BLOCK_ZONES.BODY,
    isRequired: false,
    isRemovable: true,
    isRepeatable: true,
    isLockedPosition: false,
    placeholder: "Insert table",
  },

  [BLOCK_TYPES.NUMBERED_PARAGRAPH]: {
    label: BLOCK_LABELS[BLOCK_TYPES.NUMBERED_PARAGRAPH],
    zone: BLOCK_ZONES.BODY,
    isRequired: false,
    isRemovable: true,
    isRepeatable: true,
    isLockedPosition: false,
    placeholder: "Enter numbered paragraph...",
  },

  [BLOCK_TYPES.BULLETED_LIST_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.BULLETED_LIST_BLOCK],
    zone: BLOCK_ZONES.BODY,
    isRequired: false,
    isRemovable: true,
    isRepeatable: true,
    isLockedPosition: false,
    placeholder: "(i)\n(ii)\n(iii)",
  },

  [BLOCK_TYPES.QUOTED_ORDER_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.QUOTED_ORDER_BLOCK],
    zone: BLOCK_ZONES.BODY,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "ORDERED that ...",
  },

  [BLOCK_TYPES.SIGNOFF_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.SIGNOFF_BLOCK],
    zone: BLOCK_ZONES.CLOSING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Yours faithfully,",
  },

  [BLOCK_TYPES.SIGNATURE_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.SIGNATURE_BLOCK],
    zone: BLOCK_ZONES.CLOSING,
    isRequired: false,
    isRemovable: false,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "(A.B.C.)",
  },

  [BLOCK_TYPES.DESIGNATION_CONTACT_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.DESIGNATION_CONTACT_BLOCK],
    zone: BLOCK_ZONES.CLOSING,
    isRequired: false,
    isRemovable: false,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Under Secretary to the Govt. of India\nTele: ...\nemail: ...",
  },

  [BLOCK_TYPES.COPY_TO_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.COPY_TO_BLOCK],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Copy To\n    1. ...\n    2. ...",
  },

  [BLOCK_TYPES.ENDORSEMENT_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.ENDORSEMENT_BLOCK],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder:
      "Endorsement\nNo. ...\nCopy forwarded for information/necessary action to:",
  },

  [BLOCK_TYPES.ENCLOSURE_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.ENCLOSURE_BLOCK],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: true,
    isLockedPosition: false,
    placeholder: "Encl.: As above",
  },

  [BLOCK_TYPES.PRESS_FORWARDING_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.PRESS_FORWARDING_BLOCK],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder:
      "Forwarded to the Principal Information Officer, Press Information Bureau, Government of India, New Delhi, for issuing the communiqué and giving it wide publicity.",
  },

  [BLOCK_TYPES.GAZETTE_FORWARDING_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.GAZETTE_FORWARDING_BLOCK],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder:
      "The Manager,\nGovernment of India Press,\n(Bharat Sarkar Press)\nMinto Road, New Delhi",
  },

  [BLOCK_TYPES.EMBARGO_NOTE]: {
    label: BLOCK_LABELS[BLOCK_TYPES.EMBARGO_NOTE],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "Not to be published or broadcast before ...",
  },

  [BLOCK_TYPES.ID_NOTE_FOOTER]: {
    label: BLOCK_LABELS[BLOCK_TYPES.ID_NOTE_FOOTER],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "Department of ... I.D. No. ... dated ...",
  },

  [BLOCK_TYPES.SENDER_NAME_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.SENDER_NAME_BLOCK],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "Dr. ABC",
  },

  [BLOCK_TYPES.SENDER_DESIGNATION_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.SENDER_DESIGNATION_BLOCK],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "Deputy Secretary",
  },

  [BLOCK_TYPES.CONTACT_LINE]: {
    label: BLOCK_LABELS[BLOCK_TYPES.CONTACT_LINE],
    zone: BLOCK_ZONES.HEADER,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: true,
    placeholder: "Tele: ...",
  },

  [BLOCK_TYPES.COMPLIMENTARY_CLOSE]: {
    label: BLOCK_LABELS[BLOCK_TYPES.COMPLIMENTARY_CLOSE],
    zone: BLOCK_ZONES.CLOSING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "With regards\nYours sincerely,",
  },

  [BLOCK_TYPES.RECIPIENT_IDENTITY_BLOCK]: {
    label: BLOCK_LABELS[BLOCK_TYPES.RECIPIENT_IDENTITY_BLOCK],
    zone: BLOCK_ZONES.ROUTING,
    isRequired: false,
    isRemovable: true,
    isRepeatable: false,
    isLockedPosition: false,
    placeholder: "X.Y.Z\nDeputy Secretary\nMinistry of ...",
  },
};
