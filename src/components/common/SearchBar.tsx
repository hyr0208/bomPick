import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "제목, 배우, 감독으로 검색...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center w-full max-w-xl transition-all duration-300 ${
        isFocused ? "scale-[1.02]" : ""
      }`}
    >
      {/* 검색 아이콘 */}
      <svg
        className="absolute left-3.5 w-5 h-5 text-[var(--color-text-tertiary)] transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-2xl
                   bg-[var(--color-surface)] text-[var(--color-text)]
                   border border-[var(--color-border)]
                   placeholder:text-[var(--color-text-tertiary)]
                   focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20
                   transition-all duration-300 text-sm"
      />

      {/* 클리어 버튼 */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 p-1 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <svg
            className="w-4 h-4 text-[var(--color-text-tertiary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
