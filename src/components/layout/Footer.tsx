export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <p className="text-xs text-[var(--color-text-tertiary)] text-center">
            bomPick은 메타 추천 서비스입니다. 영상은 각 OTT 플랫폼에서
            시청해주세요.
          </p>

          <p className="text-xs text-[var(--color-text-tertiary)]">
            Created by{" "}
            <span className="text-[var(--color-text-secondary)] font-medium">
              yyyerin
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
