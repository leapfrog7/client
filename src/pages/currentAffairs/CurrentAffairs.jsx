import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import PageHeader from "./components/PageHeader";
import MonthPicker from "./components/MonthPicker";
import FiltersBar from "./components/FiltersBar";
import SearchBar from "./components/SearchBar";
import AffairsList from "./components/AffairsList";
import AffairModal from "./components/AffairModal";
import SkeletonList from "./components/SkeletonList";
import EmptyState from "./components/EmptyState";
import PaginationBar from "./components/PaginationBar";

import {
  fetchMonths,
  fetchMonthItems,
  fetchBookmarks,
  fetchBookmarkedItems,
  toggleBookmark,
} from "./api/currentAffairsApi";

const PAGE_LIMIT = 20;

const CurrentAffairs = () => {
  const token = localStorage.getItem("jwtToken");
  const isLoggedIn = !!token;
  const canShowContent = isLoggedIn;

  const [monthsLoading, setMonthsLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

  const [type, setType] = useState(""); // "" | "PIB" | "GOVT_SCHEME" | "MISC" | "__BOOKMARKS__"
  const [itemsLoading, setItemsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [pagesCache, setPagesCache] = useState({}); // { [page]: { items, pagination } }

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    hasMore: false,
  });

  const [openItem, setOpenItem] = useState(null);

  const [bookmarkIds, setBookmarkIds] = useState(() => new Set());

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [modalNavLoading, setModalNavLoading] = useState(false);

  // const isBookmarksMode = type === "__BOOKMARKS__";

  const filterItemsForMode = useCallback((rawItems) => {
    return Array.isArray(rawItems) ? rawItems : [];
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      const s = q.trim();
      setDebouncedQ(s.length >= 3 ? s : "");
    }, 350);

    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!canShowContent) return;

    const run = async () => {
      setMonthsLoading(true);
      try {
        const m = await fetchMonths();
        if (!mountedRef.current) return;

        const list = Array.isArray(m) ? m : [];
        setMonths(list);

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

  useEffect(() => {
    if (!canShowContent) return;

    const run = async () => {
      try {
        const list = await fetchBookmarks();

        if (!mountedRef.current) return;

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

  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items;
  }, [items]);

  const applyPageData = useCallback((pageData, nextPage) => {
    setItems(pageData?.items || []);
    setPagination(
      pageData?.pagination || {
        page: nextPage || 1,
        limit: PAGE_LIMIT,
        total: 0,
        hasMore: false,
      },
    );
  }, []);

  const loadItems = useCallback(
    async ({
      monthKey,
      page = 1,
      nextType = type,
      nextQ = debouncedQ,
      syncState = true,
    }) => {
      if (!monthKey && nextType !== "__BOOKMARKS__") return null;

      if (syncState) setItemsLoading(true);

      try {
        // Bookmarks mode: fetch actual bookmarked items
        if (nextType === "__BOOKMARKS__") {
          const bookmarkedItems = await fetchBookmarkedItems();

          if (!mountedRef.current) return null;

          const searchedItems = nextQ
            ? bookmarkedItems.filter((it) => {
                const title = String(it?.title || "").toLowerCase();
                const content = JSON.stringify(it?.content || "").toLowerCase();
                const ql = nextQ.toLowerCase();
                return title.includes(ql) || content.includes(ql);
              })
            : bookmarkedItems;

          const start = (page - 1) * PAGE_LIMIT;
          const end = start + PAGE_LIMIT;

          const normalized = {
            items: searchedItems.slice(start, end),
            pagination: {
              page,
              limit: PAGE_LIMIT,
              total: searchedItems.length,
              hasMore: end < searchedItems.length,
            },
          };

          setPagesCache((prev) => ({
            ...prev,
            [page]: normalized,
          }));

          if (syncState) {
            applyPageData(normalized, page);
          }

          return normalized;
        }

        // Normal month mode
        const data = await fetchMonthItems({
          monthKey,
          page,
          limit: PAGE_LIMIT,
          type: nextType,
          q: nextQ,
        });

        if (!mountedRef.current) return null;

        const normalized = {
          items: data?.items || [],
          pagination: data?.pagination || {
            page,
            limit: PAGE_LIMIT,
            total: 0,
            hasMore: false,
          },
        };

        setPagesCache((prev) => ({
          ...prev,
          [page]: normalized,
        }));

        if (syncState) {
          applyPageData(normalized, page);
        }

        return normalized;
      } catch (e) {
        console.error(e);
        if (!mountedRef.current) return null;

        if (syncState) {
          setItems([]);
          setPagination({
            page: 1,
            limit: PAGE_LIMIT,
            total: 0,
            hasMore: false,
          });
        }

        return {
          items: [],
          pagination: {
            page,
            limit: PAGE_LIMIT,
            total: 0,
            hasMore: false,
          },
        };
      } finally {
        if (syncState && mountedRef.current) setItemsLoading(false);
      }
    },
    [type, debouncedQ, applyPageData],
  );

  useEffect(() => {
    if (!canShowContent) return;
    if (!selectedMonthKey) return;

    setOpenItem(null);
    setPagesCache({});
    setPagination((p) => ({ ...p, page: 1 }));

    const isFarDown = window.scrollY > 200;
    window.scrollTo({ top: 0, behavior: isFarDown ? "smooth" : "auto" });

    loadItems({
      monthKey: selectedMonthKey,
      page: 1,
      nextType: type,
      nextQ: debouncedQ,
      syncState: true,
    });
  }, [selectedMonthKey, type, canShowContent, debouncedQ, loadItems]);

  const getOrLoadPage = useCallback(
    async (page, { syncState = false } = {}) => {
      const cached = pagesCache[page];
      if (cached) {
        if (syncState) applyPageData(cached, page);
        return cached;
      }

      return loadItems({
        monthKey: selectedMonthKey,
        page,
        nextType: type,
        nextQ: debouncedQ,
        syncState,
      });
    },
    [pagesCache, applyPageData, loadItems, selectedMonthKey, type, debouncedQ],
  );

  const handlePageChange = async (nextPage) => {
    if (!selectedMonthKey) return;

    const isFarDown = window.scrollY > 200;
    window.scrollTo({ top: 0, behavior: isFarDown ? "smooth" : "auto" });

    setPagination((p) => ({ ...p, page: nextPage }));
    await getOrLoadPage(nextPage, { syncState: true });
  };

  const currentModalIndex = useMemo(() => {
    if (!openItem?._id) return -1;
    return visibleItems.findIndex((it) => it?._id === openItem._id);
  }, [openItem, visibleItems]);

  const currentGlobalIndex = useMemo(() => {
    if (!openItem || currentModalIndex < 0) return -1;
    return (
      (pagination.page - 1) * (pagination.limit || PAGE_LIMIT) +
      currentModalIndex
    );
  }, [openItem, currentModalIndex, pagination.page, pagination.limit]);

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(
        (pagination?.total || 0) / Math.max(pagination?.limit || PAGE_LIMIT, 1),
      ),
    );
  }, [pagination]);

  const handleModalNext = useCallback(async () => {
    if (!openItem) return;

    if (currentModalIndex >= 0 && currentModalIndex < visibleItems.length - 1) {
      setOpenItem(visibleItems[currentModalIndex + 1]);
      return;
    }
    setModalNavLoading(true);

    try {
      let nextPage = pagination.page + 1;

      while (nextPage <= totalPages) {
        const pageData = await getOrLoadPage(nextPage, { syncState: false });
        const nextVisibleItems = filterItemsForMode(pageData?.items || []);

        if (nextVisibleItems.length > 0) {
          applyPageData(pageData, nextPage);
          setPagination((p) => ({
            ...p,
            page: nextPage,
            limit: pageData?.pagination?.limit || p.limit,
            total: pageData?.pagination?.total || p.total,
            hasMore: pageData?.pagination?.hasMore || false,
          }));
          setOpenItem(nextVisibleItems[0]);
          return;
        }

        nextPage += 1;
      }
    } finally {
      setModalNavLoading(false);
    }
  }, [
    openItem,
    currentModalIndex,
    visibleItems,
    pagination.page,
    totalPages,
    getOrLoadPage,
    filterItemsForMode,
    applyPageData,
  ]);

  const handleModalPrev = useCallback(async () => {
    if (!openItem || modalNavLoading) return;

    // Same-page move: instant, no loader needed
    if (currentModalIndex > 0) {
      setOpenItem(visibleItems[currentModalIndex - 1]);
      return;
    }

    // Cross-page move: show loader
    setModalNavLoading(true);

    try {
      let prevPage = pagination.page - 1;

      while (prevPage >= 1) {
        const pageData = await getOrLoadPage(prevPage, { syncState: false });
        const prevVisibleItems = filterItemsForMode(pageData?.items || []);

        if (prevVisibleItems.length > 0) {
          applyPageData(pageData, prevPage);

          setPagination((p) => ({
            ...p,
            page: prevPage,
            limit: pageData?.pagination?.limit || p.limit,
            total: pageData?.pagination?.total || p.total,
            hasMore: pageData?.pagination?.hasMore || false,
          }));

          setOpenItem(prevVisibleItems[prevVisibleItems.length - 1]);
          return;
        }

        prevPage -= 1;
      }
    } finally {
      setModalNavLoading(false);
    }
  }, [
    openItem,
    modalNavLoading,
    currentModalIndex,
    visibleItems,
    pagination.page,
    getOrLoadPage,
    filterItemsForMode,
    applyPageData,
  ]);

  const modalHasPrev = useMemo(() => {
    if (!openItem) return false;
    if (currentModalIndex > 0) return true;
    return pagination.page > 1;
  }, [openItem, currentModalIndex, pagination.page]);

  const modalHasNext = useMemo(() => {
    if (!openItem) return false;
    if (currentModalIndex >= 0 && currentModalIndex < visibleItems.length - 1) {
      return true;
    }
    return pagination.page < totalPages || !!pagination.hasMore;
  }, [
    openItem,
    currentModalIndex,
    visibleItems.length,
    pagination.page,
    pagination.hasMore,
    totalPages,
  ]);

  const handleToggleBookmark = async (item) => {
    const sanityId = item?._id;
    if (!sanityId) return;

    const payload = {
      sanityId,
      monthKey: selectedMonthKey,
      type: item?.type || "MISC",
    };

    setBookmarkIds((prev) => {
      const next = new Set(prev);
      if (next.has(sanityId)) next.delete(sanityId);
      else next.add(sanityId);
      return next;
    });

    try {
      await toggleBookmark(payload);

      if (!mountedRef.current) return;

      const list = await fetchBookmarks();

      const ids = (Array.isArray(list) ? list : [])
        .map((b) => (typeof b === "string" ? b : b?.sanityId))
        .filter(Boolean);

      setBookmarkIds(new Set(ids));
    } catch (e) {
      console.error(e);
      if (!mountedRef.current) return;

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
        onChange={(mk) => {
          setOpenItem(null);
          setSelectedMonthKey(mk);
        }}
        loading={monthsLoading}
      />

      <FiltersBar
        selectedType={type}
        onTypeChange={(t) => {
          setOpenItem(null);
          setType(t);
        }}
        bookmarkCount={bookmarkIds.size}
      />

      <SearchBar
        value={q}
        onChange={(val) => {
          setOpenItem(null);
          setQ(val);
        }}
        onClear={() => setQ("")}
        disabled={monthsLoading || !selectedMonthKey}
      />

      <div className="mx-2 mt-1 text-xs text-gray-500">
        {monthTitle ? (
          <span>
            Showing <span className="font-semibold">{monthTitle}</span>
            {debouncedQ ? (
              <>
                {" "}
                • search: <span className="font-semibold">“{debouncedQ}”</span>
              </>
            ) : null}
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
          desc={
            debouncedQ
              ? "Try a different keyword, or clear search."
              : "Try another month or switch the type filter."
          }
        />
      )}

      <AffairModal
        open={!!openItem}
        item={openItem}
        items={visibleItems}
        onChangeItem={(nextItem) => setOpenItem(nextItem)}
        hasPrev={modalHasPrev}
        hasNext={modalHasNext}
        onPrev={handleModalPrev}
        onNext={handleModalNext}
        currentGlobalIndex={currentGlobalIndex}
        totalItems={pagination.total}
        navLoading={modalNavLoading}
        onClose={() => setOpenItem(null)}
      />
    </div>
  );
};

export default CurrentAffairs;
