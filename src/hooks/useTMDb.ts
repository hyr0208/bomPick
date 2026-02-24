import { useState, useEffect } from "react";
import type { Content } from "../types";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
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
 * TMDb API에서 트렌딩 + 인기 콘텐츠를 가져오는 훅.
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

        // 1) 트렌딩 + 인기 영화 + 인기 TV 동시 호출
        const [trendingRes, moviesRes, tvRes] = await Promise.all([
          fetchTrending(),
          fetchPopularMovies(),
          fetchPopularTV(),
        ]);

        if (cancelled) return;

        // 2) 중복 제거 (tmdb id 기준)
        const seen = new Set<string>();
        const allItems: Array<{
          item: TMDbTrendingItem;
          mediaType: "movie" | "tv";
        }> = [];

        // 트렌딩 (movie/tv만)
        trendingRes.results
          .filter(
            (item) => item.media_type === "movie" || item.media_type === "tv",
          )
          .forEach((item) => {
            const key = `${item.media_type}-${item.id}`;
            if (!seen.has(key)) {
              seen.add(key);
              allItems.push({ item, mediaType: item.media_type });
            }
          });

        // 인기 영화
        moviesRes.results.forEach((movie) => {
          const key = `movie-${movie.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            allItems.push({
              item: { ...movie, media_type: "movie" } as TMDbTrendingItem,
              mediaType: "movie",
            });
          }
        });

        // 인기 TV
        tvRes.results.forEach((tv) => {
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

        // 3) Watch Provider 병렬 fetch (최대 40개)
        const topItems = allItems.slice(0, 40);
        const providerResults = await Promise.allSettled(
          topItems.map(({ item, mediaType }) =>
            fetchWatchProviders(item.id, mediaType),
          ),
        );

        if (cancelled) return;

        // 4) Content[]로 변환
        const transformed: Content[] = topItems.map(
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

        // OTT가 있는 콘텐츠를 우선 정렬
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
