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

export default function Render({ mode, id, settings, bookmarks, onToggleBookmark }: Props) {
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [tafsirByAyah, setTafsirByAyah] = useState<Record<string, TafsirState>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        [key]: {
          loading: false,
          text: String(text).replace(/<[^>]+>/g, ""),
          open: true,
        },
      }));
    } catch {
      setTafsirByAyah((state) => ({
        ...state,
        [key]: { loading: false, error: "Could not load tafsir right now.", open: true },
      }));
    }
  };

  return (
    <main className="flex-1 bg-[#07090d] text-[#e4e7eb] overflow-y-auto">
      {currentSurah ? (
        <div className="text-center py-12 border-b border-[#1e222a]">
          <h2 className="text-4xl font-semibold">Surah {currentSurah.englishName.replace("-", " ")}</h2>
          <p className="mt-2 text-[#7f8692] text-lg">
            Ayah-{currentSurah.numberOfAyahs}, {currentSurah.revelationType}
          </p>
        </div>
      ) : null}

      {data.map((item, i) => {
        const ayahKey = `${item.surah.number}:${item.ayah.numberInSurah}`;
        const tafsir = tafsirByAyah[ayahKey];
        const isBookmarked = bookmarkSet.has(ayahKey);

        return (
          <article key={`${ayahKey}-${i}`} className="grid grid-cols-[64px_1fr] md:grid-cols-[88px_1fr] border-b border-[#1a1f27]">
            <div className="px-4 py-10 text-[#42a34f] font-semibold text-xl">{ayahKey}</div>

            <div className="px-6 md:px-10 py-9">
              <div className="flex items-center gap-3 text-sm text-[#8f96a2] mb-5">
                <button
                  onClick={() => handlePlayPause(item)}
                  className="h-8 px-3 rounded-full border border-[#2d333d] hover:border-[#40a54e]"
                >
                  {activeAudioKey === ayahKey ? "Pause" : "Play"}
                </button>

                <button
                  onClick={() => onToggleBookmark({ surahNumber: item.surah.number, ayahNumberInSurah: item.ayah.numberInSurah })}
                  className={`h-8 px-3 rounded-full border ${
                    isBookmarked ? "border-[#45a851] text-[#45a851]" : "border-[#2d333d]"
                  }`}
                >
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                <button
                  onClick={() => loadTafsir(item.surah.number, item.ayah.numberInSurah)}
                  className="h-8 px-3 rounded-full border border-[#2d333d] hover:border-[#40a54e]"
                >
                  Tafsir
                </button>
              </div>

              <p
                className={`text-right leading-[2.25] ${getArabicFontClass(settings.arabicFontFace)}`}
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
                  {tafsir.loading ? <p>Loading tafsir...</p> : null}
                  {tafsir.error ? <p className="text-[#d28a8a]">{tafsir.error}</p> : null}
                  {tafsir.text ? <p className="text-[#d3dae2] leading-7">{tafsir.text}</p> : null}
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </main>
  );
}
