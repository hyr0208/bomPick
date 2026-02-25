import { useState, useRef } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 모바일 키보드 닫기
    inputRef.current?.blur();
  };

  return (
    <form
      onSubmit={handleSubmit}
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
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-11 pr-20 py-3 rounded-2xl
                   bg-[var(--color-surface)] text-[var(--color-text)]
                   border border-[var(--color-border)]
                   placeholder:text-[var(--color-text-tertiary)]
                   focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20
                   transition-all duration-300 text-sm"
      />

      {/* 클리어 버튼 */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-12 p-1 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors"
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

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="absolute right-2 p-2 rounded-xl
                   text-[var(--color-text-tertiary)] hover:text-primary-500
                   hover:bg-[var(--color-surface-hover)]
                   transition-all duration-200"
        aria-label="검색"
      >
        <svg
          className="w-5 h-5"
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
      </button>
    </form>
  );
}
