import { useEffect, useState } from "react";

export default function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (error) {
      console.error(
        `Failed to initialize localStorage state for key: ${key}`,
        error,
      );
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(
        `Failed to persist localStorage state for key: ${key}`,
        error,
      );
    }
  }, [key, state]);

  return [state, setState];
}
