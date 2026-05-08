"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getJuz, getPage, getSurah } from "@/lib/quranIndex";
import { Ayah, Surah } from "@/types/quran";
import { BookmarkItem, ReadingSettingsState, ReaderMode } from "@/types/reader";

type RenderAyah = {
  surah: Surah;
  ayah: Ayah;
};

type Props = {
  mode: ReaderMode;
  id: number;
  settings: ReadingSettingsState;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: { surahNumber: number; ayahNumberInSurah: number }) => void;
};

type TafsirState = {
  loading: boolean;
  text?: string;
  error?: string;
  open: boolean;
};

const pad3 = (value: number) => value.toString().padStart(3, "0");

const getAyahAudioUrl = (surahNumber: number, ayahNumberInSurah: number) =>
  `https://everyayah.com/data/Alafasy_128kbps/${pad3(surahNumber)}${pad3(ayahNumberInSurah)}.mp3`;

const getArabicFontClass = (font: ReadingSettingsState["arabicFontFace"]) => {
  if (font === "amiri") return "font-amiri";
  if (font === "scheherazade") return "font-scheherazade";
  return "font-kfgq";
};

// Tooltip wrapper
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group flex items-center justify-center">
      {children}
      <div
        className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50
          whitespace-nowrap rounded-md bg-[#1e242e] border border-[#2d333d] px-2.5 py-1
          text-xs text-[#c8cdd5] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        {label}
        {/* Arrow */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#2d333d]" />
      </div>
    </div>
  );
}

// Icon: Play triangle
function PlayIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        // Pause icon
        <>
          <rect x="2.5" y="2" width="3.5" height="11" rx="1" fill="currentColor" />
          <rect x="9" y="2" width="3.5" height="11" rx="1" fill="currentColor" />
        </>
      ) : (
        // Play icon
        <path d="M3 2.5L12.5 7.5L3 12.5V2.5Z" fill="currentColor" />
      )}
    </svg>
  );
}

// Icon: Open book (Tafsir)
function TafsirIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 2.5C1.5 2.5 3.5 2 7.5 2C11.5 2 13.5 2.5 13.5 2.5V12.5C13.5 12.5 11.5 12 7.5 12C3.5 12 1.5 12.5 1.5 12.5V2.5Z"
        stroke="currentColor" strokeWidth="1.2" fill="none"
      />
      <line x1="7.5" y1="2" x2="7.5" y2="12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// Icon: Bookmark
function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 1.5H12.5V14.5L7 11L1.5 14.5V1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

// Icon: Three dots (More)
function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="3" r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Icon: Copy
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="8.5" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 10H2C1.72 10 1.5 9.78 1.5 9.5V1.5C1.5 1.22 1.72 1 2 1H10C10.28 1 10.5 1.22 10.5 1.5V2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// Icon: Link
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 8.5L8.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 3.5L8.5 2C9.33 1.17 10.67 1.17 11.5 2C12.33 2.83 12.33 4.17 11.5 5L10 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 10.5L5.5 12C4.67 12.83 3.33 12.83 2.5 12C1.67 11.17 1.67 9.83 2.5 9L4 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Icon: Share
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.3 6.2L9.8 3.2M4.3 7.8L9.8 10.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export default function Render({ mode, id, settings, bookmarks, onToggleBookmark }: Props) {
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [tafsirByAyah, setTafsirByAyah] = useState<Record<string, TafsirState>>({});
  const [openMoreKey, setOpenMoreKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const moreRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo<RenderAyah[]>(() => {
    if (mode === "surah") {
      const surah = getSurah(id);
      return surah ? surah.ayahs.map((ayah) => ({ surah, ayah })) : [];
    }
    if (mode === "juz") {
      return getJuz(id).map(({ surah, ayahIndex }) => ({ surah, ayah: surah.ayahs[ayahIndex] }));
    }
    return getPage(id).map(({ surah, ayahIndex }) => ({ surah, ayah: surah.ayahs[ayahIndex] }));
  }, [mode, id]);

  const bookmarkSet = useMemo(() => new Set(bookmarks.map((b) => b.key)), [bookmarks]);

  useEffect(() => {
    if (!audioRef.current && typeof Audio !== "undefined") {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setActiveAudioKey(null);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Close more menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setOpenMoreKey(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentSurah = data[0]?.surah;

  const handlePlayPause = (item: RenderAyah) => {
    const audio = audioRef.current;
    if (!audio) return;
    const key = `${item.surah.number}:${item.ayah.numberInSurah}`;
    if (activeAudioKey === key) {
      audio.pause();
      setActiveAudioKey(null);
      return;
    }
    audio.src = getAyahAudioUrl(item.surah.number, item.ayah.numberInSurah);
    audio.play().catch(() => setActiveAudioKey(null));
    setActiveAudioKey(key);
  };

  const loadTafsir = async (surahNumber: number, ayahNumberInSurah: number) => {
    const key = `${surahNumber}:${ayahNumberInSurah}`;
    const prev = tafsirByAyah[key];
    if (prev?.text) {
      setTafsirByAyah((state) => ({ ...state, [key]: { ...prev, open: !prev.open } }));
      return;
    }
    setTafsirByAyah((state) => ({ ...state, [key]: { loading: true, open: true } }));
    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/tafsirs/169/by_ayah/${surahNumber}:${ayahNumberInSurah}`
      );
      const json = await response.json();
      const text = json?.tafsir?.text ?? "Tafsir unavailable for this ayah.";
      setTafsirByAyah((state) => ({
        ...state,
        [key]: { loading: false, text: String(text).replace(/<[^>]+>/g, ""), open: true },
      }));
    } catch {
      setTafsirByAyah((state) => ({
        ...state,
        [key]: { loading: false, error: "Could not load tafsir right now.", open: true },
      }));
    }
  };

  const handleCopyAyah = (item: RenderAyah) => {
    const text = `${item.ayah.text}\n\n${item.ayah.translation?.text ?? ""}\n— ${item.surah.englishName} ${item.surah.number}:${item.ayah.numberInSurah}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setOpenMoreKey(null);
  };

  const handleCopyLink = (item: RenderAyah) => {
    const url = `${window.location.origin}/surah/${item.surah.number}#${item.ayah.numberInSurah}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setOpenMoreKey(null);
  };

  const handleShare = async (item: RenderAyah) => {
    const text = `${item.ayah.text}\n${item.ayah.translation?.text ?? ""}\n— ${item.surah.englishName} ${item.surah.number}:${item.ayah.numberInSurah}`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
    }
    setOpenMoreKey(null);
  };

  return (
    <main className="flex-1 bg-[#0d0d0d] text-[#e4e7eb] overflow-y-auto">
      {currentSurah ? (
        <div className="text-center py-12 border-b border-[#1e222a]">
          <h2 className="text-2xl font-semibold">Surah {currentSurah.englishName.replace("-", " ")}</h2>
          <p className="mt-2 text-[#7f8692] text-sm">
            {currentSurah.numberOfAyahs} Ayahs · {currentSurah.revelationType}
          </p>
        </div>
      ) : null}

      {data.map((item, i) => {
        const ayahKey = `${item.surah.number}:${item.ayah.numberInSurah}`;
        const tafsir = tafsirByAyah[ayahKey];
        const isBookmarked = bookmarkSet.has(ayahKey);
        const isMoreOpen = openMoreKey === ayahKey;
        const isPlaying = activeAudioKey === ayahKey;

        return (
          <article
            key={`${ayahKey}-${i}`}
            className="flex border-b border-[#1a1f27]"
          >
            {/* Left icon sidebar */}
            <div className="flex flex-col items-center gap-1 pt-10 pb-6 px-3 w-[52px] shrink-0">
              {/* Ayah number */}
              <span className="text-[#42a34f] font-semibold text-xs mb-3 text-center leading-tight">
                {item.surah.number}:{item.ayah.numberInSurah}
              </span>

              {/* Play */}
              <Tooltip label={isPlaying ? "Pause" : "Play"}>
                <button
                  onClick={() => handlePlayPause(item)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${isPlaying
                      ? "text-[#42a34f] bg-[#42a34f1a]"
                      : "text-[#5c6470] hover:text-[#42a34f] hover:bg-[#42a34f12]"
                    }`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <PlayIcon active={isPlaying} />
                </button>
              </Tooltip>

              {/* Tafsir */}
              <Tooltip label="Tafsir">
                <button
                  onClick={() => loadTafsir(item.surah.number, item.ayah.numberInSurah)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${tafsir?.open
                      ? "text-[#42a34f] bg-[#42a34f1a]"
                      : "text-[#5c6470] hover:text-[#42a34f] hover:bg-[#42a34f12]"
                    }`}
                  aria-label="Tafsir"
                >
                  <TafsirIcon />
                </button>
              </Tooltip>

              {/* Bookmark */}
              <Tooltip label={isBookmarked ? "Remove Bookmark" : "Bookmark"}>
                <button
                  onClick={() =>
                    onToggleBookmark({
                      surahNumber: item.surah.number,
                      ayahNumberInSurah: item.ayah.numberInSurah,
                    })
                  }
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${isBookmarked
                      ? "text-[#42a34f] bg-[#42a34f1a]"
                      : "text-[#5c6470] hover:text-[#42a34f] hover:bg-[#42a34f12]"
                    }`}
                  aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                  <BookmarkIcon active={isBookmarked} />
                </button>
              </Tooltip>

              {/* More (3 dots) */}
              <div className="relative" ref={isMoreOpen ? moreRef : undefined}>
                <Tooltip label="More">
                  <button
                    onClick={() => setOpenMoreKey(isMoreOpen ? null : ayahKey)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                      ${isMoreOpen
                        ? "text-[#42a34f] bg-[#42a34f1a]"
                        : "text-[#5c6470] hover:text-[#42a34f] hover:bg-[#42a34f12]"
                      }`}
                    aria-label="More options"
                  >
                    <MoreIcon />
                  </button>
                </Tooltip>

                {/* More dropdown */}
                {isMoreOpen && (
                  <div
                    className="absolute left-full top-0 ml-2 z-50 min-w-[160px] rounded-xl
                      border border-[#2d333d] bg-[#141920] shadow-xl shadow-black/40
                      py-1 overflow-hidden"
                  >
                    <button
                      onClick={() => handleCopyAyah(item)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#c8cdd5]
                        hover:bg-[#1e252f] hover:text-white transition-colors text-left"
                    >
                      <CopyIcon />
                      Ayah Copy
                    </button>
                    <button
                      onClick={() => handleCopyLink(item)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#c8cdd5]
                        hover:bg-[#1e252f] hover:text-white transition-colors text-left"
                    >
                      <LinkIcon />
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#c8cdd5]
                        hover:bg-[#1e252f] hover:text-white transition-colors text-left"
                    >
                      <ShareIcon />
                      Ayah Share
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 px-8 md:px-12 py-9">
              <p
                className={`text-right leading-[2.3] ${getArabicFontClass(settings.arabicFontFace)}`}
                style={{ fontSize: `${settings.arabicFontSize}px` }}
                dir="rtl"
              >
                {item.ayah.text}
              </p>

              {settings.contentMode === "translation" ? (
                <div className="mt-6">
                  <p className="text-[#6f7783] uppercase tracking-[0.08em] text-xs">Saheeh International</p>
                  <p className="mt-2 text-[#d4d9df]" style={{ fontSize: `${settings.translationFontSize}px` }}>
                    {item.ayah.translation?.text}
                  </p>
                </div>
              ) : null}

              {tafsir?.open ? (
                <div className="mt-6 rounded-xl border border-[#243543] bg-[#0b131b] p-4">
                  <p className="text-sm text-[#95a5b8] mb-2">Tafsir (Ibn Kathir)</p>
                  {tafsir.loading ? <p className="text-[#6f7783] text-sm">Loading tafsir...</p> : null}
                  {tafsir.error ? <p className="text-[#d28a8a] text-sm">{tafsir.error}</p> : null}
                  {tafsir.text ? (
                    <p className="text-[#d3dae2] leading-7 text-sm">{tafsir.text}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </main>
  );
}