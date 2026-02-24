import { useState } from "react";
import type { Content } from "../types";
import { ContentCard } from "../components/common/ContentCard";
import { ContentDetailModal } from "../components/common/ContentDetailModal";
import { FilterPanel } from "../components/filters/FilterPanel";
import { useContentFilter } from "../hooks/useContentFilter";
import { mockContents } from "../data/mockContents";

interface HomePageProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function HomePage({ searchQuery, onSearchChange }: HomePageProps) {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const {
    filters,
    filteredContents,
    activeFilterCount,
    toggleOtt,
    toggleGenre,
    toggleCountry,
    toggleMood,
    toggleContentType,
    setSortBy,
    resetFilters,
  } = useContentFilter(mockContents);

  // searchQuery를 외부(Header)에서도 받아서 동기화
  const displayContents = filteredContents.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.title.toLowerCase().includes(q) ||
      c.originalTitle?.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.cast?.some((a) => a.toLowerCase().includes(q)) ||
      c.director?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative text-center py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">오늘 뭐 볼까?</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-lg mx-auto mb-6">
            넷플릭스, 디즈니+, 티빙 등 모든 OTT의 콘텐츠를
            <br className="hidden sm:inline" />
            한곳에서 필터링하고 추천받으세요.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-text-tertiary)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>{mockContents.length}개 콘텐츠</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎬</span>
              <span>6개 OTT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex gap-8">
        {/* 필터 사이드바 */}
        <FilterPanel
          filters={filters}
          activeFilterCount={activeFilterCount}
          onToggleOtt={toggleOtt}
          onToggleGenre={toggleGenre}
          onToggleCountry={toggleCountry}
          onToggleMood={toggleMood}
          onToggleContentType={toggleContentType}
          onSortChange={setSortBy}
          onReset={() => {
            resetFilters();
            onSearchChange("");
          }}
        />

        {/* 콘텐츠 그리드 */}
        <main className="flex-1 min-w-0">
          {/* 결과 헤더 */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-text)]">
                {displayContents.length}
              </span>
              개의 콘텐츠
              {(activeFilterCount > 0 || searchQuery) && (
                <span className="ml-1 text-primary-400">(필터 적용됨)</span>
              )}
            </p>
          </div>

          {/* 그리드 */}
          {displayContents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayContents.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">
                다른 필터 조건이나 검색어로 시도해보세요.
              </p>
              <button
                onClick={() => {
                  resetFilters();
                  onSearchChange("");
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white
                           bg-gradient-to-r from-primary-500 to-purple-500
                           hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                필터 초기화
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 상세 모달 */}
      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </>
  );
}
