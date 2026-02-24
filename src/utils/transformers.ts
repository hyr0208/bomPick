import type { Content } from "../types";
import type { OttPlatform, Genre, Country } from "../types";
import type {
  TMDbTrendingItem,
  TMDbMovie,
  TMDbTV,
  TMDbWatchProviders,
} from "../services/tmdb";
import {
  IMAGE_BASE_URL,
  PROVIDER_ID_MAP,
  GENRE_ID_MAP,
} from "../services/tmdb";

/** 포스터 이미지 URL 생성 */
export function posterUrl(path: string | null, size = "w500"): string {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

/** 배경 이미지 URL 생성 */
export function backdropUrl(path: string | null, size = "w1280"): string {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

/** TMDb origin_country/original_language → 앱 Country 타입 */
function mapCountry(
  originCountry?: string[],
  originalLanguage?: string,
): Country {
  const code = originCountry?.[0] || "";
  const map: Record<string, Country> = {
    KR: "kr",
    US: "us",
    JP: "jp",
    GB: "gb",
    FR: "fr",
    ES: "es",
    DE: "de",
  };
  if (map[code]) return map[code];

  // fallback: original_language 기반
  const langMap: Record<string, Country> = {
    ko: "kr",
    en: "us",
    ja: "jp",
    fr: "fr",
    es: "es",
    de: "de",
  };
  return langMap[originalLanguage || ""] || "us";
}

/** TMDb genre_ids → 앱 Genre[] */
function mapGenres(genreIds: number[]): Genre[] {
  const genres = new Set<Genre>();
  genreIds.forEach((id) => {
    const mapped = GENRE_ID_MAP[id];
    if (mapped) genres.add(mapped as Genre);
  });
  return Array.from(genres);
}

/** TMDb watch providers → 앱 OttPlatform[] */
export function mapProviders(providers: TMDbWatchProviders): OttPlatform[] {
  const krProviders = providers.results?.KR?.flatrate || [];
  const platforms = new Set<OttPlatform>();
  krProviders.forEach((p) => {
    const mapped = PROVIDER_ID_MAP[p.provider_id];
    if (mapped) platforms.add(mapped as OttPlatform);
  });
  return Array.from(platforms);
}

/** Trending/검색 결과 → Content (watch providers 포함) */
export function transformTrendingItem(
  item: TMDbTrendingItem,
  providers: OttPlatform[],
): Content {
  const isMovie = item.media_type === "movie";
  const title = isMovie ? item.title || "" : item.name || "";
  const originalTitle = isMovie
    ? item.original_title || ""
    : item.original_name || "";
  const releaseDate = isMovie
    ? item.release_date || ""
    : item.first_air_date || "";

  return {
    id: `tmdb-${item.media_type}-${item.id}`,
    tmdbId: item.id,
    mediaType: item.media_type,
    title,
    originalTitle,
    posterUrl: posterUrl(item.poster_path),
    backdropUrl: backdropUrl(item.backdrop_path),
    description: item.overview || "설명 없음",
    rating: Math.round(item.vote_average * 10) / 10,
    releaseYear: releaseDate ? new Date(releaseDate).getFullYear() : 0,
    ottPlatforms: providers,
    genres: mapGenres(item.genre_ids),
    country: mapCountry(item.origin_country, item.original_language),
    contentType: isMovie ? "movie" : "drama",
    popularity: Math.round(item.popularity),
  };
}

/** 영화 API 결과 → Content */
export function transformMovie(
  movie: TMDbMovie,
  providers: OttPlatform[],
): Content {
  return transformTrendingItem(
    {
      ...movie,
      media_type: "movie",
      title: movie.title,
      original_title: movie.original_title,
    } as TMDbTrendingItem,
    providers,
  );
}

/** TV API 결과 → Content */
export function transformTV(tv: TMDbTV, providers: OttPlatform[]): Content {
  return transformTrendingItem(
    {
      ...tv,
      media_type: "tv",
      name: tv.name,
      original_name: tv.original_name,
    } as TMDbTrendingItem,
    providers,
  );
}
