export function createOfficeProfileModel(overrides = {}) {
  return {
    govtLineEn: "Government of India",
    govtLineHi: "",
    departmentEn: "Department of ...",
    departmentHi: "",
    city: "New Delhi",
    defaultSignatoryName: "(A.B.C.)",
    defaultSignatoryDesignation: "Under Secretary to the Govt. of India",
    defaultPhone: "Tele: ...",
    defaultEmail: "",

    includeGovtLineEn: true,
    includeGovtLineHi: false,
    includeDepartmentEn: true,
    includeDepartmentHi: false,
    includeCity: true,
    includeSignatoryName: true,
    includeSignatoryDesignation: true,
    includePhone: true,
    includeEmail: false,

    ...overrides,
  };
}
