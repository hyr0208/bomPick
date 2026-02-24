import { useState, useMemo, useCallback } from "react";
import type {
  Content,
  FilterState,
  OttPlatform,
  Genre,
  Country,
  ContentType,
  SortOption,
} from "../types";
import { initialFilterState } from "../types";

export function useContentFilter(contents: Content[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const toggleOtt = useCallback((ott: OttPlatform) => {
    setFilters((prev) => ({
      ...prev,
      selectedOtt: prev.selectedOtt.includes(ott)
        ? prev.selectedOtt.filter((o) => o !== ott)
        : [...prev.selectedOtt, ott],
    }));
  }, []);

  const toggleGenre = useCallback((genre: Genre) => {
    setFilters((prev) => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter((g) => g !== genre)
        : [...prev.selectedGenres, genre],
    }));
  }, []);

  const toggleCountry = useCallback((country: Country) => {
    setFilters((prev) => ({
      ...prev,
      selectedCountries: prev.selectedCountries.includes(country)
        ? prev.selectedCountries.filter((c) => c !== country)
        : [...prev.selectedCountries, country],
    }));
  }, []);

  const toggleContentType = useCallback((type: ContentType) => {
    setFilters((prev) => ({
      ...prev,
      selectedContentTypes: prev.selectedContentTypes.includes(type)
        ? prev.selectedContentTypes.filter((t) => t !== type)
        : [...prev.selectedContentTypes, type],
    }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const activeFilterCount = useMemo(() => {
    return (
      filters.selectedOtt.length +
      filters.selectedGenres.length +
      filters.selectedCountries.length +
      filters.selectedContentTypes.length
    );
  }, [filters]);

  const filteredContents = useMemo(() => {
    let result = [...contents];

    // 검색어 필터
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.originalTitle?.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.cast?.some((actor) => actor.toLowerCase().includes(query)) ||
          c.director?.toLowerCase().includes(query),
      );
    }

    // OTT 필터
    if (filters.selectedOtt.length > 0) {
      result = result.filter((c) =>
        filters.selectedOtt.some((ott) => c.ottPlatforms.includes(ott)),
      );
    }

    // 장르 필터
    if (filters.selectedGenres.length > 0) {
      result = result.filter((c) =>
        filters.selectedGenres.some((genre) => c.genres.includes(genre)),
      );
    }

    // 국가 필터
    if (filters.selectedCountries.length > 0) {
      result = result.filter((c) =>
        filters.selectedCountries.includes(c.country),
      );
    }

    // 콘텐츠 유형 필터
    if (filters.selectedContentTypes.length > 0) {
      result = result.filter((c) =>
        filters.selectedContentTypes.includes(c.contentType),
      );
    }

    // 정렬
    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "latest":
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "popularity":
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return result;
  }, [contents, filters]);

  return {
    filters,
    filteredContents,
    activeFilterCount,
    toggleOtt,
    toggleGenre,
    toggleCountry,
    toggleContentType,
    setSortBy,
    setSearchQuery,
    resetFilters,
  };
}
