// src/hooks/useFileDrop.js
import { useCallback, useEffect } from "react";

/**
 * useFileDrop
 * - Prevents browser navigation when files are dropped anywhere on the page
 * - Handles drops on a specific element (via onDrop/onDragOver you attach)
 * - Calls `onFiles(files)` with a FileList
 */
export default function useFileDrop(onFiles) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files?.length) onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  const handleDragOver = useCallback((e) => {
    // Indicate copy action & prevent navigation
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Optional global guard: stop the browser from opening the file
  useEffect(() => {
    const preventDocNav = (e) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    window.addEventListener("dragover", preventDocNav);
    window.addEventListener("drop", preventDocNav);
    return () => {
      window.removeEventListener("dragover", preventDocNav);
      window.removeEventListener("drop", preventDocNav);
    };
  }, []);

  return { handleDrop, handleDragOver };
}
