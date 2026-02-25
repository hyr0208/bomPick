import { SearchBar } from "../common/SearchBar";

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Header({
  isDark,
  onToggleDark,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-[var(--color-border)]
                        bg-[var(--color-bg)]/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 로고 */}
          <a href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <svg
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="header-logo-bg"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#7C3AED" }} />
                  <stop offset="100%" style={{ stopColor: "#EC4899" }} />
                </linearGradient>
              </defs>
              <rect
                width="512"
                height="512"
                rx="96"
                fill="url(#header-logo-bg)"
              />
              <polygon
                points="200,140 200,372 380,256"
                fill="white"
                opacity={0.95}
              />
              <path
                d="M260 300 L300 340 L370 230"
                stroke="#7C3AED"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="text-xl font-extrabold gradient-text hidden sm:inline">
              bomPick
            </span>
          </a>

          {/* 검색바 */}
          <div className="flex-1 max-w-xl mx-auto">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>

          {/* 다크모드 토글 */}
          <button
            onClick={onToggleDark}
            className="flex-shrink-0 p-2.5 rounded-xl
                       hover:bg-[var(--color-surface-hover)] transition-all duration-300
                       group"
            aria-label="다크모드 전환"
          >
            {isDark ? (
              <svg
                className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-primary-500 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
