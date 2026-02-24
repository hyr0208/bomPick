import { useState } from "react";
import type { Content } from "../../types";
import { GENRE_LABELS } from "../../types";
import { OttBadge } from "./OttBadge";

interface ContentCardProps {
  content: Content;
  onClick: () => void;
}

export function ContentCard({ content, onClick }: ContentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer card-hover
                 bg-[var(--color-surface)] border border-[var(--color-border)]"
      onClick={onClick}
    >
      {/* 포스터 */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[var(--color-surface-hover)] animate-pulse flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[var(--color-text-tertiary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        )}
        <img
          src={content.posterUrl}
          alt={content.title}
          className={`w-full h-full object-cover transition-all duration-500
                      group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-700 flex items-center justify-center p-4">
            <span className="text-white font-bold text-center text-lg leading-tight">
              {content.title}
            </span>
          </div>
        )}

        {/* 호버 오버레이 */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        flex flex-col justify-end p-4"
        >
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white/80 text-xs line-clamp-3 mb-2">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {content.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] text-white/70 bg-white/20 px-2 py-0.5 rounded-full"
                >
                  {GENRE_LABELS[genre]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 평점 배지 */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg
                        bg-black/60 backdrop-blur-sm text-yellow-400 text-xs font-bold"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {content.rating.toFixed(1)}
        </div>
      </div>

      {/* 카드 하단 정보 */}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-sm text-[var(--color-text)] truncate">
          {content.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-secondary)]">
            {content.releaseYear}
          </span>
          <div className="flex gap-1 flex-wrap justify-end">
            {content.ottPlatforms.slice(0, 2).map((ott) => (
              <OttBadge key={ott} platform={ott} size="sm" />
            ))}
            {content.ottPlatforms.length > 2 && (
              <span className="text-[10px] text-[var(--color-text-tertiary)] self-center">
                +{content.ottPlatforms.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
