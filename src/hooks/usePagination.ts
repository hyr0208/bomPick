import { useState, useMemo, useEffect } from "react";

interface UsePaginationReturn<T> {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  totalCount: number;
  visibleCount: number;
}

/**
 * 클라이언트 측 페이지네이션 훅.
 * items 배열이 바뀌면 (필터/검색 변경) 자동으로 첫 페이지로 리셋.
 */
export function usePagination<T>(
  items: T[],
  pageSize = 24,
): UsePaginationReturn<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // items가 변경되면 (필터/검색 변경 시) 첫 페이지로 리셋
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const hasMore = visibleCount < items.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
  };

  return {
    visibleItems,
    hasMore,
    loadMore,
    totalCount: items.length,
    visibleCount: Math.min(visibleCount, items.length),
  };
}
