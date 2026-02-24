const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "ko-KR");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb API error: ${res.status}`);
  return res.json();
}

// ---------- TMDb API 응답 타입 ----------

export interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  origin_country?: string[];
}

export interface TMDbTV {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  origin_country: string[];
}

export interface TMDbTrendingItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  origin_country?: string[];
}

interface TMDbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDbWatchProviders {
  results: {
    KR?: {
      flatrate?: { provider_id: number; provider_name: string }[];
      buy?: { provider_id: number; provider_name: string }[];
      rent?: { provider_id: number; provider_name: string }[];
    };
  };
}

export interface TMDbCredits {
  cast: { name: string; known_for_department: string }[];
  crew: { name: string; job: string }[];
}

export interface TMDbMovieDetail extends TMDbMovie {
  runtime: number | null;
  credits: TMDbCredits;
}

export interface TMDbTVDetail extends TMDbTV {
  number_of_episodes: number;
  number_of_seasons: number;
  credits: TMDbCredits;
}

// ---------- API 호출 함수 ----------

/** 한국 OTT Provider ID 목록 (|로 구분 = OR 조건) */
const KR_PROVIDER_IDS = "8|337|97|356|1796|2039"; // Netflix, Disney+, Watcha, Wavve, Tving, Coupang

/**
 * 한국 OTT에서 볼 수 있는 영화 (Discover API)
 * providerId를 지정하면 특정 OTT 플랫폼의 콘텐츠만 가져옴
 */
export async function discoverMovies(
  page = 1,
  providerId?: string,
): Promise<TMDbListResponse<TMDbMovie>> {
  return fetchJson(
    buildUrl("/discover/movie", {
      page: String(page),
      watch_region: "KR",
      with_watch_providers: providerId || KR_PROVIDER_IDS,
      with_watch_monetization_types: "flatrate",
      sort_by: "popularity.desc",
    }),
  );
}

/**
 * 한국 OTT에서 볼 수 있는 TV (Discover API)
 */
export async function discoverTV(
  page = 1,
  providerId?: string,
): Promise<TMDbListResponse<TMDbTV>> {
  return fetchJson(
    buildUrl("/discover/tv", {
      page: String(page),
      watch_region: "KR",
      with_watch_providers: providerId || KR_PROVIDER_IDS,
      with_watch_monetization_types: "flatrate",
      sort_by: "popularity.desc",
    }),
  );
}

/** 콘텐츠 OTT 정보 (watch providers) */
export async function fetchWatchProviders(
  id: number,
  mediaType: "movie" | "tv",
): Promise<TMDbWatchProviders> {
  return fetchJson(buildUrl(`/${mediaType}/${id}/watch/providers`));
}

/** 통합 검색 */
export async function searchMulti(
  query: string,
  page = 1,
): Promise<TMDbListResponse<TMDbTrendingItem>> {
  return fetchJson(
    buildUrl("/search/multi", { query, page: String(page), region: "KR" }),
  );
}

// ---------- 매핑 테이블 ----------

/** TMDb Watch Provider ID → 앱 OTT 플랫폼 키 */
export const PROVIDER_ID_MAP: Record<number, string> = {
  8: "netflix",
  337: "disney",
  97: "watcha",
  356: "wavve",
  // 티빙 — TMDb에 여러 ID로 존재할 수 있음
  1796: "tving",
  // 쿠팡플레이
  2039: "coupang",
};

/** TMDb Genre ID → 앱 Genre 키 */
export const GENRE_ID_MAP: Record<number, string> = {
  // 영화 장르
  28: "action",
  12: "action", // Adventure → action
  16: "animation",
  35: "comedy",
  80: "crime",
  99: "documentary",
  18: "drama",
  10751: "drama", // Family → drama
  14: "fantasy",
  36: "drama", // History → drama
  27: "horror",
  10402: "drama", // Music → drama
  9648: "mystery",
  10749: "romance",
  878: "sf",
  10770: "drama", // TV Movie → drama
  53: "thriller",
  10752: "action", // War → action
  37: "action", // Western → action
  // TV 장르
  10759: "action", // Action & Adventure
  10762: "animation", // Kids
  10763: "documentary", // News → documentary
  10764: "drama", // Reality
  10765: "sf", // Sci-Fi & Fantasy
  10766: "drama", // Soap
  10767: "drama", // Talk
  10768: "thriller", // War & Politics
};
