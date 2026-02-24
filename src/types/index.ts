// OTT 플랫폼
export type OttPlatform =
  | "netflix"
  | "disney"
  | "tving"
  | "wavve"
  | "coupang"
  | "watcha";

export const OTT_LABELS: Record<OttPlatform, string> = {
  netflix: "넷플릭스",
  disney: "디즈니+",
  tving: "티빙",
  wavve: "웨이브",
  coupang: "쿠팡플레이",
  watcha: "왓챠",
};

export const OTT_COLORS: Record<OttPlatform, string> = {
  netflix: "#E50914",
  disney: "#113CCF",
  tving: "#FF0558",
  wavve: "#1B1B4B",
  coupang: "#FF5A2D",
  watcha: "#FF0558",
};

export const OTT_URLS: Record<OttPlatform, string> = {
  netflix: "https://www.netflix.com",
  disney: "https://www.disneyplus.com",
  tving: "https://www.tving.com",
  wavve: "https://www.wavve.com",
  coupang: "https://www.coupangplay.com",
  watcha: "https://www.watcha.com",
};

// 장르
export type Genre =
  | "romance"
  | "thriller"
  | "horror"
  | "comedy"
  | "action"
  | "sf"
  | "drama"
  | "animation"
  | "documentary"
  | "fantasy"
  | "crime"
  | "mystery";

export const GENRE_LABELS: Record<Genre, string> = {
  romance: "로맨스",
  thriller: "스릴러",
  horror: "호러",
  comedy: "코미디",
  action: "액션",
  sf: "SF",
  drama: "드라마",
  animation: "애니메이션",
  documentary: "다큐멘터리",
  fantasy: "판타지",
  crime: "범죄",
  mystery: "미스터리",
};

// 국가
export type Country = "kr" | "us" | "jp" | "gb" | "fr" | "es" | "de";

export const COUNTRY_LABELS: Record<Country, string> = {
  kr: "한국",
  us: "미국",
  jp: "일본",
  gb: "영국",
  fr: "프랑스",
  es: "스페인",
  de: "독일",
};

export const COUNTRY_FLAGS: Record<Country, string> = {
  kr: "🇰🇷",
  us: "🇺🇸",
  jp: "🇯🇵",
  gb: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
};

// 분위기
export type Mood =
  | "touching"
  | "thrilling"
  | "light"
  | "immersive"
  | "healing"
  | "heartpounding"
  | "dark"
  | "funny";

export const MOOD_LABELS: Record<Mood, string> = {
  touching: "감동적인",
  thrilling: "긴장감 넘치는",
  light: "가벼운",
  immersive: "몰입감 있는",
  healing: "힐링",
  heartpounding: "심장쿵쾅",
  dark: "다크한",
  funny: "웃긴",
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  touching: "🥹",
  thrilling: "😰",
  light: "😊",
  immersive: "🤯",
  healing: "🍀",
  heartpounding: "💓",
  dark: "🌑",
  funny: "😂",
};

// 콘텐츠 유형
export type ContentType = "movie" | "drama" | "variety" | "documentary";

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  movie: "영화",
  drama: "드라마",
  variety: "예능",
  documentary: "다큐",
};

// 정렬 옵션
export type SortOption = "rating" | "latest" | "popularity";

export const SORT_LABELS: Record<SortOption, string> = {
  rating: "평점순",
  latest: "최신순",
  popularity: "인기순",
};

// 콘텐츠 인터페이스
export interface Content {
  id: string;
  tmdbId?: number;
  mediaType?: "movie" | "tv";
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  description: string;
  rating: number;
  releaseYear: number;
  ottPlatforms: OttPlatform[];
  genres: Genre[];
  country: Country;
  contentType: ContentType;
  director?: string;
  cast?: string[];
  runtime?: number; // 분 단위 (영화)
  episodes?: number; // 에피소드 수 (드라마)
  popularity: number; // 인기도 점수
}

// 필터 상태
export interface FilterState {
  selectedOtt: OttPlatform[];
  selectedGenres: Genre[];
  selectedCountries: Country[];
  selectedContentTypes: ContentType[];
  sortBy: SortOption;
  searchQuery: string;
}

export const initialFilterState: FilterState = {
  selectedOtt: [],
  selectedGenres: [],
  selectedCountries: [],
  selectedContentTypes: [],
  sortBy: "popularity",
  searchQuery: "",
};
