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
  isLoadingMore: boolean;
  error: string | null;
}

/** Phase 1: 주요 OTT (빠르게 먼저 로딩) */
const PHASE1_OTTS: OttPlatform[] = ["netflix", "disney", "tving"];
/** Phase 2: 보조 OTT (백그라운드 로딩) */
const PHASE2_OTTS: OttPlatform[] = ["wavve", "coupang", "watcha"];

/** 각 OTT당 fetch 할 페이지 수 (1페이지 = ~20개) */
const PAGES_MAP: Record<OttPlatform, number> = {
  netflix: 5,
  disney: 5,
  tving: 5,
  wavve: 4,
  coupang: 4,
  watcha: 4,
};

type FetchTask = {
  ott: OttPlatform;
  providerId: number;
  mediaType: "movie" | "tv";
  page: number;
};

/** OTT 목록에 대한 fetch 작업 목록 생성 */
function buildFetchTasks(otts: OttPlatform[]): FetchTask[] {
  const tasks: FetchTask[] = [];
  for (const ott of otts) {
    const providerId = OTT_PROVIDER_IDS[ott];
    const pages = PAGES_MAP[ott];
    for (let page = 1; page <= pages; page++) {
      tasks.push({ ott, providerId, mediaType: "movie", page });
      tasks.push({ ott, providerId, mediaType: "tv", page });
    }
  }
  return tasks;
}

/** 작업 목록을 실행하고, 결과를 contentMap에 병합 */
async function executeFetchTasks(
  tasks: FetchTask[],
  contentMap: Map<string, Content>,
): Promise<void> {
  const results = await Promise.allSettled(
    tasks.map((task) =>
      task.mediaType === "movie"
        ? discoverMovies(task.page, String(task.providerId))
        : discoverTV(task.page, String(task.providerId)),
    ),
  );

  results.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    const task = tasks[index];
    const items = result.value.results;

    items.forEach((item: TMDbMovie | TMDbTV) => {
      const key = `${task.mediaType}-${item.id}`;
      const existing = contentMap.get(key);

      if (existing) {
        if (!existing.ottPlatforms.includes(task.ott)) {
          existing.ottPlatforms.push(task.ott);
        }
      } else {
        const content =
          task.mediaType === "movie"
            ? transformMovie(item as TMDbMovie, [task.ott])
            : transformTV(item as TMDbTV, [task.ott]);
        contentMap.set(key, content);
      }
    });
  });
}

/** contentMap을 인기도순 정렬된 배열로 변환 */
function sortedContents(contentMap: Map<string, Content>): Content[] {
  const arr = Array.from(contentMap.values());
  arr.sort((a, b) => b.popularity - a.popularity);
  return arr;
}

/**
 * 2단계 로딩으로 콘텐츠를 가져오는 훅.
 *
 * Phase 1: 넷플릭스, 디즈니+, 티빙 (주요 OTT) → 즉시 표시
 * Phase 2: 웨이브, 쿠팡플레이, 왓챠 → 백그라운드 추가 로딩
 */
export function useTMDb(): UseTMDbReturn {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const contentMap = new Map<string, Content>();

        // ── Phase 1: 주요 OTT 먼저 로딩 ──
        const phase1Tasks = buildFetchTasks(PHASE1_OTTS);
        await executeFetchTasks(phase1Tasks, contentMap);

        if (cancelled) return;

        // Phase 1 결과 즉시 표시
        setContents(sortedContents(contentMap));
        setIsLoading(false);

        // ── Phase 2: 보조 OTT 백그라운드 로딩 ──
        setIsLoadingMore(true);
        const phase2Tasks = buildFetchTasks(PHASE2_OTTS);
        await executeFetchTasks(phase2Tasks, contentMap);

        if (cancelled) return;

        // Phase 2 결과 병합
        setContents(sortedContents(contentMap));
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
          setIsLoadingMore(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { contents, isLoading, isLoadingMore, error };
}
