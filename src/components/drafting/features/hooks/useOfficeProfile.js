import { useCallback, useEffect, useState } from "react";
import {
  getStoredOfficeProfile,
  saveStoredOfficeProfile,
  resetStoredOfficeProfile,
} from "../services/officeProfileStorage";

export default function useOfficeProfile() {
  const [officeProfile, setOfficeProfile] = useState(getStoredOfficeProfile);

  useEffect(() => {
    setOfficeProfile(getStoredOfficeProfile());
  }, []);

  const saveOfficeProfile = useCallback((profile) => {
    const next = saveStoredOfficeProfile(profile);
    setOfficeProfile(next);
    return next;
  }, []);

  const resetOfficeProfile = useCallback(() => {
    const next = resetStoredOfficeProfile();
    setOfficeProfile(next);
    return next;
  }, []);

  return {
    officeProfile,
    saveOfficeProfile,
    resetOfficeProfile,
  };
}
