import { useState, useEffect } from "react";
import type { Content } from "../types";
import {
  discoverMovies,
  discoverTV,
  fetchWatchProviders,
} from "../services/tmdb";
import type { TMDbTrendingItem } from "../services/tmdb";
import {
  transformMovie,
  transformTV,
  mapProviders,
} from "../utils/transformers";

interface UseTMDbReturn {
  contents: Content[];
  isLoading: boolean;
  error: string | null;
}

/**
 * TMDb Discover API로 한국 OTT에서 실제 볼 수 있는 콘텐츠를 가져오는 훅.
 * 각 콘텐츠의 한국 OTT 정보도 함께 가져옴.
 */
export function useTMDb(): UseTMDbReturn {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // 1) 한국 OTT에서 볼 수 있는 영화 + TV 동시 호출 (2페이지씩)
        const [moviesP1, moviesP2, tvP1, tvP2] = await Promise.all([
          discoverMovies(1),
          discoverMovies(2),
          discoverTV(1),
          discoverTV(2),
        ]);

        if (cancelled) return;

        // 2) 중복 제거 (tmdb id 기준)
        const seen = new Set<string>();
        const allItems: Array<{
          item: TMDbTrendingItem;
          mediaType: "movie" | "tv";
        }> = [];

        // 영화 추가
        [...moviesP1.results, ...moviesP2.results].forEach((movie) => {
          const key = `movie-${movie.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            allItems.push({
              item: { ...movie, media_type: "movie" } as TMDbTrendingItem,
              mediaType: "movie",
            });
          }
        });

        // TV 추가
        [...tvP1.results, ...tvP2.results].forEach((tv) => {
          const key = `tv-${tv.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            allItems.push({
              item: {
                ...tv,
                media_type: "tv",
                name: tv.name,
                original_name: tv.original_name,
              } as TMDbTrendingItem,
              mediaType: "tv",
            });
          }
        });

        // 3) Watch Provider 병렬 fetch (각 콘텐츠가 어떤 OTT에 있는지)
        const providerResults = await Promise.allSettled(
          allItems.map(({ item, mediaType }) =>
            fetchWatchProviders(item.id, mediaType),
          ),
        );

        if (cancelled) return;

        // 4) Content[]로 변환
        const transformed: Content[] = allItems.map(
          ({ item, mediaType }, index) => {
            const providerResult = providerResults[index];
            const providers =
              providerResult.status === "fulfilled"
                ? mapProviders(providerResult.value)
                : [];

            if (mediaType === "movie") {
              return transformMovie(item as any, providers);
            } else {
              return transformTV(item as any, providers);
            }
          },
        );

        // OTT가 있는 콘텐츠를 우선 정렬, 그 다음 인기도순
        transformed.sort((a, b) => {
          if (a.ottPlatforms.length > 0 && b.ottPlatforms.length === 0)
            return -1;
          if (a.ottPlatforms.length === 0 && b.ottPlatforms.length > 0)
            return 1;
          return b.popularity - a.popularity;
        });

        setContents(transformed);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "데이터를 불러오는 데 실패했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { contents, isLoading, error };
}
