import { useState, useEffect, useCallback } from "react";
import type { Content } from "../../types";
import {
  GENRE_LABELS,
  COUNTRY_FLAGS,
  COUNTRY_LABELS,
  OTT_URLS,
} from "../../types";
import { OttBadge } from "./OttBadge";

interface RandomPickModalProps {
  candidates: Content[];
  onClose: () => void;
}

type Phase = "spinning" | "result";

export function RandomPickModal({ candidates, onClose }: RandomPickModalProps) {
  const [phase, setPhase] = useState<Phase>("spinning");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pickedContent, setPickedContent] = useState<Content | null>(null);

  // 모달 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 최종 결과를 미리 결정
  const finalPick = useCallback(() => {
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }, [candidates]);

  useEffect(() => {
    const picked = finalPick();
    setPickedContent(picked);

    // 슬롯 애니메이션: 빠르게 → 느리게 포스터 전환
    let spinCount = 0;
    const maxSpins = 20;

    const spin = () => {
      spinCount++;
      setCurrentIndex(Math.floor(Math.random() * candidates.length));

      if (spinCount < maxSpins) {
        // 점점 느려지는 인터벌
        const delay = 60 + spinCount * 30;
        setTimeout(spin, delay);
      } else {
        // 최종 결과 세팅
        const finalIdx = candidates.indexOf(picked);
        setCurrentIndex(finalIdx >= 0 ? finalIdx : 0);
        setTimeout(() => setPhase("result"), 300);
      }
    };

    setTimeout(spin, 200);
  }, [candidates, finalPick]);

  // 다시 추천
  const handleRetry = () => {
    setPhase("spinning");
    const picked = finalPick();
    setPickedContent(picked);

    let spinCount = 0;
    const maxSpins = 15;

    const spin = () => {
      spinCount++;
      setCurrentIndex(Math.floor(Math.random() * candidates.length));

      if (spinCount < maxSpins) {
        const delay = 60 + spinCount * 35;
        setTimeout(spin, delay);
      } else {
        const finalIdx = candidates.indexOf(picked);
        setCurrentIndex(finalIdx >= 0 ? finalIdx : 0);
        setTimeout(() => setPhase("result"), 300);
      }
    };

    spin();
  };

  const displayContent =
    phase === "result" ? pickedContent : candidates[currentIndex];

  if (!displayContent) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10 sm:p-8"
      onClick={onClose}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* 모달 컨테이너 */}
      <div
        className="relative w-full max-w-sm sm:max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 타이틀 + 닫기 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1" />
          <div className="text-center">
            {phase === "spinning" ? (
              <div className="animate-pulse">
                <div className="text-3xl mb-1">🎰</div>
                <p className="text-white font-bold text-base">
                  추천 콘텐츠를 고르는 중...
                </p>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-1">🎬</div>
                <p className="text-white font-bold text-base">
                  오늘은 이거 어때요?
                </p>
              </>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 rounded-full
                         bg-white/10 backdrop-blur-sm
                         text-white/80 hover:text-white hover:bg-white/20
                         transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 카드 */}
        <div
          className={`rounded-3xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]
                      shadow-2xl transition-all duration-500 ${
                        phase === "spinning"
                          ? "scale-95 opacity-80"
                          : "scale-100 opacity-100"
                      }`}
        >
          {/* 포스터 */}
          <div className="relative h-[40vh] min-h-[200px] overflow-hidden">
            <img
              src={displayContent.posterUrl}
              alt={displayContent.title}
              className={`w-full h-full object-cover transition-all duration-200 ${
                phase === "spinning" ? "blur-[2px]" : "blur-0"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/500x750/1a1b1e/5c7cfa?text=${encodeURIComponent(displayContent.title)}`;
              }}
            />

            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />

            {/* 평점 */}
            <div
              className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-xl
                          bg-yellow-500/90 text-black font-bold text-sm
                          transition-all duration-500 ${
                            phase === "result"
                              ? "scale-100 opacity-100"
                              : "scale-0 opacity-0"
                          }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {displayContent.rating.toFixed(1)}
            </div>
          </div>

          {/* 정보 영역 */}
          <div
            className={`p-5 space-y-3 transition-all duration-500 ${
              phase === "result"
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-50"
            }`}
          >
            {/* 제목 */}
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                {displayContent.title}
              </h2>
              {displayContent.originalTitle && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {displayContent.originalTitle}
                </p>
              )}
            </div>

            {/* 메타 */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <span>{displayContent.releaseYear}</span>
              <span>·</span>
              <span>
                {COUNTRY_FLAGS[displayContent.country]}{" "}
                {COUNTRY_LABELS[displayContent.country]}
              </span>
              {displayContent.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium
                             bg-primary-500/10 text-primary-400"
                >
                  {GENRE_LABELS[genre]}
                </span>
              ))}
            </div>

            {/* OTT 배지 */}
            <div className="flex flex-wrap gap-2">
              {displayContent.ottPlatforms.map((ott) => (
                <a
                  key={ott}
                  href={OTT_URLS[ott]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  <OttBadge platform={ott} size="md" />
                  <svg
                    className="w-3 h-3 text-[var(--color-text-tertiary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>

            {/* 설명 */}
            {phase === "result" && displayContent.description && (
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
                {displayContent.description}
              </p>
            )}

            {/* 버튼 */}
            {phase === "result" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold
                             bg-gradient-to-r from-primary-500 to-purple-500 text-white
                             hover:shadow-lg hover:shadow-primary-500/25
                             hover:scale-[1.02] active:scale-[0.98]
                             transition-all duration-200"
                >
                  🎲 다시 추천
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl text-sm font-medium
                             bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]
                             border border-[var(--color-border)]
                             hover:text-[var(--color-text)] transition-colors"
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 하단 안내 */}
        {phase === "result" && (
          <p className="text-center text-xs text-white/40 mt-4">
            {candidates.length}개 콘텐츠 중 랜덤 추천
          </p>
        )}
      </div>
    </div>
  );
}
