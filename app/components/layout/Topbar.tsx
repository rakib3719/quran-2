import React from "react";

// Search icon
function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Moon icon (dark mode toggle)
function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5 9.5A6.5 6.5 0 0 1 7 2.5a6.5 6.5 0 1 0 7.5 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Small leaf/flower icon inside button
function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 1C7 1 3 3 3 7C3 9.76 4.86 12.07 7 13C9.14 12.07 11 9.76 11 7C11 3 7 1 7 1Z"
        fill="rgba(255,255,255,0.7)"
      />
      <line x1="7" y1="13" x2="7" y2="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    </svg>
  );
}

type Props = {
  onSearchClick?: () => void;
  onThemeToggle?: () => void;
  onSupportClick?: () => void;
};

export default function Topbar({ onSearchClick, onThemeToggle, onSupportClick }: Props) {
  return (
    <header className="w-full bg-[var(--panel)] border-b border-[var(--border-soft)] h-[56px] flex items-center px-5 md:px-7">
      {/* Left: Logo */}
      <div className="flex flex-col justify-center">
        <span className="text-[var(--fg)] font-bold text-[15px] leading-tight tracking-tight">
          Quran Mazid
        </span>
        <span className="text-[var(--text-soft)] text-[11px] leading-tight mt-0.5">
          Read, Study, and Learn The Quran
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: icons + button */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => {
            onSearchClick?.();
            window.dispatchEvent(new CustomEvent("focus-reader-search"));
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#5a6270]
            hover:text-[#a0a8b4] hover:bg-[#1e242e] transition-colors"
          aria-label="Search"
        >
          <SearchIcon />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={onThemeToggle}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#42a34f]
            hover:bg-[#42a34f15] transition-colors"
          aria-label="Toggle theme"
        >
          <MoonIcon />
        </button>

        {/* Support Us button */}
        <button
          onClick={onSupportClick}
          className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#2e7d34]
            hover:bg-[#38963f] active:bg-[#276b2d] transition-colors
            text-white text-[13px] font-semibold tracking-tight"
          aria-label="Support Us"
        >
          Support Us
          <LeafIcon />
        </button>
      </div>
    </header>
  );
}
