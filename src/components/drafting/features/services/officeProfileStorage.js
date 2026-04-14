// import { STORAGE_KEYS } from "../constants/storageKeys";
// import { createOfficeProfileModel } from "../models/officeProfileModel";

// export function getStoredOfficeProfile() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEYS.OFFICE_PROFILE);
//     if (!raw) return createOfficeProfileModel();

//     const parsed = JSON.parse(raw);
//     return createOfficeProfileModel(parsed);
//   } catch (error) {
//     console.error("Failed to read office profile from localStorage:", error);
//     return createOfficeProfileModel();
//   }
// }

// export function saveStoredOfficeProfile(profile) {
//   try {
//     const payload = createOfficeProfileModel(profile);
//     localStorage.setItem(STORAGE_KEYS.OFFICE_PROFILE, JSON.stringify(payload));
//     return payload;
//   } catch (error) {
//     console.error("Failed to save office profile to localStorage:", error);
//     throw error;
//   }
// }

// export function resetStoredOfficeProfile() {
//   try {
//     const payload = createOfficeProfileModel();
//     localStorage.setItem(STORAGE_KEYS.OFFICE_PROFILE, JSON.stringify(payload));
//     return payload;
//   } catch (error) {
//     console.error("Failed to reset office profile in localStorage:", error);
//     throw error;
//   }
// }

import { STORAGE_KEYS } from "../constants/storageKeys";
import { createOfficeProfileModel } from "../models/officeProfileModel";

export function getStoredOfficeProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFICE_PROFILE);
    if (!raw) return createOfficeProfileModel();

    const parsed = JSON.parse(raw);
    return createOfficeProfileModel(parsed);
  } catch (error) {
    console.error("Failed to read office profile from localStorage:", error);
    return createOfficeProfileModel();
  }
}

export function saveStoredOfficeProfile(profile) {
  try {
    const payload = createOfficeProfileModel(profile);
    localStorage.setItem(STORAGE_KEYS.OFFICE_PROFILE, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to save office profile to localStorage:", error);
    throw error;
  }
}

export function resetStoredOfficeProfile() {
  try {
    const payload = createOfficeProfileModel();
    localStorage.setItem(STORAGE_KEYS.OFFICE_PROFILE, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to reset office profile in localStorage:", error);
    throw error;
  }
}
