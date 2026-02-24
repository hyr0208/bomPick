import { useState } from "react";
import type {
  OttPlatform,
  Genre,
  Country,
  ContentType,
  SortOption,
  FilterState,
} from "../../types";
import {
  OTT_LABELS,
  OTT_COLORS,
  GENRE_LABELS,
  COUNTRY_LABELS,
  COUNTRY_FLAGS,
  CONTENT_TYPE_LABELS,
  SORT_LABELS,
} from "../../types";

interface FilterPanelProps {
  filters: FilterState;
  activeFilterCount: number;
  onToggleOtt: (ott: OttPlatform) => void;
  onToggleGenre: (genre: Genre) => void;
  onToggleCountry: (country: Country) => void;

  onToggleContentType: (type: ContentType) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const ALL_OTTS: OttPlatform[] = [
  "netflix",
  "disney",
  "tving",
  "wavve",
  "coupang",
  "watcha",
];
const ALL_GENRES: Genre[] = [
  "romance",
  "thriller",
  "horror",
  "comedy",
  "action",
  "sf",
  "drama",
  "animation",
  "documentary",
  "fantasy",
  "crime",
  "mystery",
];
const ALL_COUNTRIES: Country[] = ["kr", "us", "jp", "gb", "fr", "es", "de"];

const ALL_CONTENT_TYPES: ContentType[] = [
  "movie",
  "drama",
  "variety",
  "documentary",
];
const ALL_SORTS: SortOption[] = ["popularity", "rating", "latest"];

export function FilterPanel({
  filters,
  activeFilterCount,
  onToggleOtt,
  onToggleGenre,
  onToggleCountry,

  onToggleContentType,
  onSortChange,
  onReset,
}: FilterPanelProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    ott: true,
    genre: true,
    country: false,

    type: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filterContent = (
    <>
      {/* 정렬 */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-4 h-4 text-[var(--color-text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span className="text-sm font-semibold text-[var(--color-text)]">
            정렬
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SORTS.map((sort) => (
            <button
              key={sort}
              onClick={() => onSortChange(sort)}
              className={`chip ${filters.sortBy === sort ? "chip-active" : "chip-default"}`}
            >
              {SORT_LABELS[sort]}
            </button>
          ))}
        </div>
      </div>

      {/* OTT */}
      <FilterSection
        title="OTT 플랫폼"
        icon="📺"
        isExpanded={expandedSections.ott}
        onToggle={() => toggleSection("ott")}
      >
        <div className="flex flex-wrap gap-2">
          {ALL_OTTS.map((ott) => (
            <button
              key={ott}
              onClick={() => onToggleOtt(ott)}
              className={`chip transition-all duration-200 ${
                filters.selectedOtt.includes(ott)
                  ? "text-white border-transparent shadow-md"
                  : "chip-default"
              }`}
              style={
                filters.selectedOtt.includes(ott)
                  ? { backgroundColor: OTT_COLORS[ott] }
                  : {}
              }
            >
              {OTT_LABELS[ott]}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 장르 */}
      <FilterSection
        title="장르"
        icon="🎬"
        isExpanded={expandedSections.genre}
        onToggle={() => toggleSection("genre")}
      >
        <div className="flex flex-wrap gap-2">
          {ALL_GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => onToggleGenre(genre)}
              className={`chip ${filters.selectedGenres.includes(genre) ? "chip-active" : "chip-default"}`}
            >
              {GENRE_LABELS[genre]}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 국가 */}
      <FilterSection
        title="국가"
        icon="🌍"
        isExpanded={expandedSections.country}
        onToggle={() => toggleSection("country")}
      >
        <div className="flex flex-wrap gap-2">
          {ALL_COUNTRIES.map((country) => (
            <button
              key={country}
              onClick={() => onToggleCountry(country)}
              className={`chip ${filters.selectedCountries.includes(country) ? "chip-active" : "chip-default"}`}
            >
              {COUNTRY_FLAGS[country]} {COUNTRY_LABELS[country]}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 콘텐츠 유형 */}
      <FilterSection
        title="유형"
        icon="🎞️"
        isExpanded={expandedSections.type}
        onToggle={() => toggleSection("type")}
      >
        <div className="flex flex-wrap gap-2">
          {ALL_CONTENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onToggleContentType(type)}
              className={`chip ${filters.selectedContentTypes.includes(type) ? "chip-active" : "chip-default"}`}
            >
              {CONTENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 초기화 */}
      {activeFilterCount > 0 && (
        <button
          onClick={onReset}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium
                     text-red-400 hover:text-red-300
                     bg-red-500/10 hover:bg-red-500/20
                     border border-red-500/20
                     transition-all duration-200"
        >
          필터 초기화 ({activeFilterCount}개 선택됨)
        </button>
      )}
    </>
  );

  return (
    <>
      {/* 모바일 필터 토글 버튼 */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2
                   px-5 py-3 rounded-full shadow-lg
                   bg-gradient-to-r from-primary-500 to-purple-500 text-white
                   hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        필터
        {activeFilterCount > 0 && (
          <span className="bg-white text-primary-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* 모바일 필터 드로어 */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-[var(--color-overlay)] animate-fade-in" />
          <div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw]
                        bg-[var(--color-surface)] shadow-2xl p-6 overflow-y-auto animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                필터
              </h3>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[var(--color-text-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* 데스크탑 사이드바 */}
      <aside
        className="hidden lg:block w-72 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto
                         p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
      >
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-5">
          필터
        </h3>
        {filterContent}
      </aside>
    </>
  );
}

// 필터 섹션 아코디언
function FilterSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 pb-4 border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-[var(--color-text-tertiary)] transition-transform duration-200
                      ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && <div className="animate-fade-in">{children}</div>}
    </div>
  );
}
