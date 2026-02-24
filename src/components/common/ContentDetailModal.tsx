import type { Content } from "../../types";
import {
  GENRE_LABELS,
  COUNTRY_FLAGS,
  COUNTRY_LABELS,
  CONTENT_TYPE_LABELS,
  OTT_URLS,
} from "../../types";
import { OttBadge } from "./OttBadge";

interface ContentDetailModalProps {
  content: Content;
  onClose: () => void;
}

export function ContentDetailModal({
  content,
  onClose,
}: ContentDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-[var(--color-overlay)] animate-fade-in" />

      {/* 모달 */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl
                    bg-[var(--color-surface)] border border-[var(--color-border)]
                    shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full
                     bg-black/50 hover:bg-black/70 text-white transition-colors"
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

        {/* 포스터 상단 */}
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl">
          <img
            src={content.posterUrl}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/500x750/1a1b1e/5c7cfa?text=${encodeURIComponent(content.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />

          {/* 평점 */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/90 text-black font-bold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {content.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 정보 */}
        <div className="p-6 space-y-5">
          {/* 제목 */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              {content.title}
            </h2>
            {content.originalTitle && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                {content.originalTitle}
              </p>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span>{content.releaseYear}</span>
            <span>·</span>
            <span>{CONTENT_TYPE_LABELS[content.contentType]}</span>
            <span>·</span>
            <span>
              {COUNTRY_FLAGS[content.country]} {COUNTRY_LABELS[content.country]}
            </span>
            {content.runtime && (
              <>
                <span>·</span>
                <span>
                  {Math.floor(content.runtime / 60)}시간 {content.runtime % 60}
                  분
                </span>
              </>
            )}
            {content.episodes && (
              <>
                <span>·</span>
                <span>{content.episodes}화</span>
              </>
            )}
          </div>

          {/* OTT 플랫폼 */}
          <div className="flex flex-wrap gap-2">
            {content.ottPlatforms.map((ott) => (
              <a
                key={ott}
                href={OTT_URLS[ott]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:scale-105 transition-transform"
              >
                <OttBadge platform={ott} size="md" />
                <svg
                  className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]"
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
          <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
            {content.description}
          </p>

          {/* 장르 */}
          <div className="flex flex-wrap gap-2">
            {content.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-full text-xs font-medium
                           bg-primary-500/10 text-primary-400 border border-primary-500/20"
              >
                {GENRE_LABELS[genre]}
              </span>
            ))}
          </div>

          {/* 감독 & 출연 */}
          {(content.director || content.cast) && (
            <div className="space-y-2 text-sm">
              {content.director && (
                <div>
                  <span className="text-[var(--color-text-tertiary)]">
                    감독{" "}
                  </span>
                  <span className="text-[var(--color-text)]">
                    {content.director}
                  </span>
                </div>
              )}
              {content.cast && content.cast.length > 0 && (
                <div>
                  <span className="text-[var(--color-text-tertiary)]">
                    출연{" "}
                  </span>
                  <span className="text-[var(--color-text)]">
                    {content.cast.join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* OTT에서 보기 안내 */}
          <div className="pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-tertiary)] text-center">
              💡 bomPick은 메타 추천 서비스입니다. 영상은 각 OTT 플랫폼에서
              시청해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
