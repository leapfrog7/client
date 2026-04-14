export function createOfficeProfileModel(overrides = {}) {
  const legacyName = overrides.defaultSignatoryName ?? "(A.B.C.)";
  const legacyDesignation =
    overrides.defaultSignatoryDesignation ??
    "Under Secretary to the Govt. of India";
  const legacyPhone = overrides.defaultPhone ?? "Tele: ...";
  const legacyEmail = overrides.defaultEmail ?? "";

  const incomingProfiles = Array.isArray(overrides.signatoryProfiles)
    ? overrides.signatoryProfiles.slice(0, 10)
    : [];

  const normalizedProfiles =
    incomingProfiles.length > 0
      ? incomingProfiles.map((profile, index) => ({
          id: profile.id || `sig_${index + 1}`,
          label: profile.label || `Signatory ${index + 1}`,
          name: profile.name || "",
          designation: profile.designation || "",
          phone: profile.phone || "",
          email: profile.email || "",
        }))
      : [
          {
            id: "sig_1",
            label: "Default signatory",
            name: legacyName,
            designation: legacyDesignation,
            phone: legacyPhone,
            email: legacyEmail,
          },
        ];

  const selectedSignatoryProfileId =
    overrides.selectedSignatoryProfileId &&
    normalizedProfiles.some(
      (profile) => profile.id === overrides.selectedSignatoryProfileId,
    )
      ? overrides.selectedSignatoryProfileId
      : normalizedProfiles[0].id;

  return {
    govtLineEn: "Government of India",
    govtLineHi: "",
    departmentEn: "Department of ...",
    departmentHi: "",
    city: "New Delhi",

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

    signatoryProfiles: normalizedProfiles,
    selectedSignatoryProfileId,

    // keep legacy fields for backward compatibility
    defaultSignatoryName: normalizedProfiles[0].name || "",
    defaultSignatoryDesignation: normalizedProfiles[0].designation || "",
    defaultPhone: normalizedProfiles[0].phone || "",
    defaultEmail: normalizedProfiles[0].email || "",
  };
}

export function getSelectedSignatoryProfile(profile) {
  const profiles = Array.isArray(profile?.signatoryProfiles)
    ? profile.signatoryProfiles
    : [];

  if (!profiles.length) {
    return {
      id: "sig_1",
      label: "Default signatory",
      name: profile?.defaultSignatoryName || "",
      designation: profile?.defaultSignatoryDesignation || "",
      phone: profile?.defaultPhone || "",
      email: profile?.defaultEmail || "",
    };
  }

  return (
    profiles.find((item) => item.id === profile.selectedSignatoryProfileId) ||
    profiles[0]
  );
}
