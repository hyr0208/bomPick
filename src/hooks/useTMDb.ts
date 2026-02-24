import { useState, useEffect } from "react";
import type { Content } from "../types";
import type { OttPlatform } from "../types";
import { discoverMovies, discoverTV } from "../services/tmdb";
import type { TMDbMovie, TMDbTV } from "../services/tmdb";
import { transformMovie, transformTV } from "../utils/transformers";

/** OTT 플랫폼별 TMDb Provider ID */
const OTT_PROVIDER_IDS: Record<OttPlatform, number> = {
  netflix: 8,
  disney: 337,
  tving: 1796,
  wavve: 356,
  coupang: 2039,
  watcha: 97,
};

interface UseTMDbReturn {
  contents: Content[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 각 OTT 플랫폼별로 Discover API를 호출하여 한국에서
 * 실제 시청 가능한 콘텐츠를 최대한 많이 가져오는 훅.
 *
 * - 넷플릭스, 디즈니+, 티빙: 영화 3p + TV 3p = 각 ~120개
 * - 웨이브, 쿠팡플레이, 왓챠: 영화 2p + TV 2p = 각 ~80개
 * - 중복 콘텐츠는 OTT 배지를 병합
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

        // OTT별 (영화 + TV) 구분해서 fetch할 작업 목록 생성
        const fetchTasks: Array<{
          ott: OttPlatform;
          providerId: number;
          mediaType: "movie" | "tv";
          page: number;
        }> = [];

        // 대형 OTT: 3페이지, 소형 OTT: 2페이지
        const pagesMap: Record<OttPlatform, number> = {
          netflix: 3,
          disney: 3,
          tving: 3,
          wavve: 2,
          coupang: 2,
          watcha: 2,
        };

        for (const [ott, providerId] of Object.entries(OTT_PROVIDER_IDS)) {
          const pages = pagesMap[ott as OttPlatform];
          for (let page = 1; page <= pages; page++) {
            fetchTasks.push({
              ott: ott as OttPlatform,
              providerId,
              mediaType: "movie",
              page,
            });
            fetchTasks.push({
              ott: ott as OttPlatform,
              providerId,
              mediaType: "tv",
              page,
            });
          }
        }

        // 모든 API 호출 병렬 실행
        const results = await Promise.allSettled(
          fetchTasks.map((task) => {
            if (task.mediaType === "movie") {
              return discoverMovies(task.page, String(task.providerId));
            } else {
              return discoverTV(task.page, String(task.providerId));
            }
          }),
        );

        if (cancelled) return;

        // 결과를 Content로 변환하고 중복 병합
        const contentMap = new Map<string, Content>();

        results.forEach((result, index) => {
          if (result.status !== "fulfilled") return;
          const task = fetchTasks[index];
          const items = result.value.results;

          items.forEach((item: TMDbMovie | TMDbTV) => {
            const key = `${task.mediaType}-${item.id}`;
            const existing = contentMap.get(key);

            if (existing) {
              // 이미 있으면 OTT 플랫폼만 추가
              if (!existing.ottPlatforms.includes(task.ott)) {
                existing.ottPlatforms.push(task.ott);
              }
            } else {
              // 새 콘텐츠 생성
              let content: Content;
              if (task.mediaType === "movie") {
                content = transformMovie(item as TMDbMovie, [task.ott]);
              } else {
                content = transformTV(item as TMDbTV, [task.ott]);
              }
              contentMap.set(key, content);
            }
          });
        });

        // Map → Array, 인기도순 정렬
        const allContents = Array.from(contentMap.values());
        allContents.sort((a, b) => b.popularity - a.popularity);

        setContents(allContents);
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
