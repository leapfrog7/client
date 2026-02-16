import { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "./components/PageHeader";
import MonthPicker from "./components/MonthPicker";
import FiltersBar from "./components/FiltersBar";
import AffairsList from "./components/AffairsList";
import AffairModal from "./components/AffairModal";
import SkeletonList from "./components/SkeletonList";
import EmptyState from "./components/EmptyState";
import PaginationBar from "./components/PaginationBar";

import {
  fetchMonths,
  fetchMonthItems,
  fetchBookmarks,
  toggleBookmark,
} from "./api/currentAffairsApi";

const CurrentAffairs = () => {
  const token = localStorage.getItem("jwtToken");
  const isLoggedIn = !!token;
  const canShowContent = isLoggedIn;

  const [monthsLoading, setMonthsLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

  const [type, setType] = useState(""); // "" | "PIB" | "GOVT_SCHEME" | "MISC"
  const [itemsLoading, setItemsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  });

  const [openItem, setOpenItem] = useState(null);

  // Bookmarks: store Sanity _id strings
  const [bookmarkIds, setBookmarkIds] = useState(() => new Set());

  // Mounted guard
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Load months once
  useEffect(() => {
    if (!canShowContent) return;

    const run = async () => {
      setMonthsLoading(true);
      try {
        const m = await fetchMonths();
        if (!mountedRef.current) return;

        const list = Array.isArray(m) ? m : [];
        setMonths(list);

        // auto-select latest month if none selected
        if (list.length) {
          setSelectedMonthKey((prev) => prev || list[0].monthKey);
        }
      } catch (e) {
        console.error(e);
        if (mountedRef.current) setMonths([]);
      } finally {
        if (mountedRef.current) setMonthsLoading(false);
      }
    };

    run();
  }, [canShowContent]);

  // Load bookmarks once
  useEffect(() => {
    if (!canShowContent) return;

    const run = async () => {
      try {
        const list = await fetchBookmarks();

        if (!mountedRef.current) return;

        // Accept BOTH formats:
        // 1) ["sanityId1", "sanityId2"]
        // 2) [{ sanityId: "..." }, ...]
        const ids = (Array.isArray(list) ? list : [])
          .map((b) => (typeof b === "string" ? b : b?.sanityId))
          .filter(Boolean);

        setBookmarkIds(new Set(ids));
      } catch (e) {
        console.error("Bookmarks load failed", e);
        if (mountedRef.current) setBookmarkIds(new Set());
      }
    };

    run();
  }, [canShowContent]);

  const monthTitle = useMemo(() => {
    const m = months.find((x) => x.monthKey === selectedMonthKey);
    return m?.title || "";
  }, [months, selectedMonthKey]);

  const isBookmarksMode = type === "__BOOKMARKS__";
  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!isBookmarksMode) return items;
    return items.filter((it) => bookmarkIds.has(it._id));
  }, [items, bookmarkIds, isBookmarksMode]);
  // Core loader (safe for unmount)

  const loadItems = async ({ monthKey, page = 1, nextType = type }) => {
    if (!monthKey) return;

    // ✅ If "Your Bookmarks" selected, fetch ALL items (no server type filter)
    const serverType = nextType === "__BOOKMARKS__" ? "" : nextType;

    setItemsLoading(true);
    try {
      const data = await fetchMonthItems({
        monthKey,
        page,
        limit: 20,
        type: serverType,
      });

      if (!mountedRef.current) return;

      setItems(data?.items || []);
      setPagination(
        data?.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
      );
    } catch (e) {
      console.error(e);
      if (!mountedRef.current) return;
      setItems([]);
      setPagination({ page: 1, limit: 20, total: 0, hasMore: false });
    } finally {
      if (mountedRef.current) setItemsLoading(false);
    }
  };

  // Load items when month/type/page changes (SINGLE source of truth)
  useEffect(() => {
    if (!canShowContent) return;
    if (!selectedMonthKey) return;

    // If month/type changes, always reset to page 1
    setPagination((p) => ({ ...p, page: 1 }));

    // Scroll top nicely
    const isFarDown = window.scrollY > 200;
    window.scrollTo({ top: 0, behavior: isFarDown ? "smooth" : "auto" });

    loadItems({ monthKey: selectedMonthKey, page: 1, nextType: type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonthKey, type, canShowContent]);

  const handlePageChange = (nextPage) => {
    if (!selectedMonthKey) return;

    const isFarDown = window.scrollY > 200;
    window.scrollTo({ top: 0, behavior: isFarDown ? "smooth" : "auto" });

    // Update pagination page immediately for UI
    setPagination((p) => ({ ...p, page: nextPage }));

    loadItems({ monthKey: selectedMonthKey, page: nextPage, nextType: type });
  };

  const handleToggleBookmark = async (item) => {
    const sanityId = item?._id;
    if (!sanityId) return;

    const payload = {
      sanityId,
      monthKey: selectedMonthKey,
      type: item?.type || "MISC",
    };

    // optimistic UI
    setBookmarkIds((prev) => {
      const next = new Set(prev);
      if (next.has(sanityId)) next.delete(sanityId);
      else next.add(sanityId);
      return next;
    });

    try {
      const res = await toggleBookmark(payload); // { bookmarked, sanityId }

      if (!mountedRef.current) return;

      // trust server truth
      setBookmarkIds((prev) => {
        const next = new Set(prev);
        const id = res?.sanityId || sanityId;
        if (res?.bookmarked) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch (e) {
      console.error(e);
      if (!mountedRef.current) return;

      // revert on error
      setBookmarkIds((prev) => {
        const next = new Set(prev);
        if (next.has(sanityId)) next.delete(sanityId);
        else next.add(sanityId);
        return next;
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white flex flex-col w-full xl:w-4/5 mx-auto">
        <PageHeader />
        <EmptyState
          title="Please login to access Current Affairs"
          desc="This module is available for logged-in users only."
        />
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col w-full xl:w-4/5 mx-auto pb-10">
      <PageHeader />

      <MonthPicker
        months={months}
        selectedMonthKey={selectedMonthKey}
        onChange={setSelectedMonthKey}
        loading={monthsLoading}
      />

      <FiltersBar
        selectedType={type}
        onTypeChange={setType}
        bookmarkCount={bookmarkIds.size}
      />

      <div className="mx-2 mt-3 text-xs text-gray-500">
        {monthTitle ? (
          <span>
            Showing <span className="font-semibold">{monthTitle}</span>
            {pagination?.total ? ` • ${pagination.total} items` : ""}
          </span>
        ) : null}
      </div>

      {itemsLoading ? (
        <SkeletonList />
      ) : visibleItems.length ? (
        <>
          <AffairsList
            items={visibleItems}
            onOpen={(it) => setOpenItem(it)}
            bookmarkIds={bookmarkIds}
            onToggleBookmark={handleToggleBookmark}
          />

          <PaginationBar
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            hasMore={pagination.hasMore}
            loading={itemsLoading}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          title="No items found"
          desc="Try another month or switch the type filter."
        />
      )}

      <AffairModal
        open={!!openItem}
        item={openItem}
        onClose={() => setOpenItem(null)}
      />
    </div>
  );
};

export default CurrentAffairs;
