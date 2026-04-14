import { useCallback, useEffect, useState } from "react";
import {
  getAllParagraphBankItems,
  saveParagraphBankItem,
  deleteParagraphBankItem,
} from "../services/paragraphBankStorage";

export default function useParagraphBank() {
  const [items, setItems] = useState([]);

  const refresh = useCallback(() => {
    setItems(getAllParagraphBankItems());
  }, []);

  useEffect(() => {
    refresh();

    const handleStorageChange = (event) => {
      if (event.key === "drafting_paragraph_bank") {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("paragraph-bank-updated", refresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("paragraph-bank-updated", refresh);
    };
  }, [refresh]);

  const saveItem = useCallback(
    (item) => {
      const saved = saveParagraphBankItem(item);
      refresh();
      window.dispatchEvent(new Event("paragraph-bank-updated"));
      return saved;
    },
    [refresh],
  );

  const removeItem = useCallback(
    (id) => {
      deleteParagraphBankItem(id);
      refresh();
      window.dispatchEvent(new Event("paragraph-bank-updated"));
    },
    [refresh],
  );

  return {
    items,
    refresh,
    saveItem,
    removeItem,
  };
}
