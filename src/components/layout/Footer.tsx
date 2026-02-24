export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500
                            flex items-center justify-center text-white font-bold text-[10px]"
            >
              B
            </div>
            <span className="text-sm font-bold gradient-text">bomPick</span>
          </div>

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
