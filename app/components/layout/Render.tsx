"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSurah, getJuz, getPage } from "@/lib/quranIndex";
import { Ayah, Surah } from "@/types/quran";

type ReaderMode = "surah" | "juz" | "page";

type RenderAyah = {
  surah: Surah;
  ayah: Ayah;
};

const pad3 = (value: number) => value.toString().padStart(3, "0");

const getAyahAudioUrl = (surahNumber: number, ayahNumberInSurah: number) => {
  return `https://everyayah.com/data/Alafasy_128kbps/${pad3(surahNumber)}${pad3(ayahNumberInSurah)}.mp3`;
};

export default function Render({ mode, id }: { mode: ReaderMode; id: number }) {
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const data = useMemo<RenderAyah[]>(() => {
    if (mode === "surah") {
      const surah = getSurah(id);
      return surah ? surah.ayahs.map((ayah) => ({ surah, ayah })) : [];
    }

    if (mode === "juz") {
      return getJuz(id).map(({ surah, ayahIndex }) => ({
        surah,
        ayah: surah.ayahs[ayahIndex],
      }));
    }

    return getPage(id).map(({ surah, ayahIndex }) => ({
      surah,
      ayah: surah.ayahs[ayahIndex],
    }));
  }, [mode, id]);

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
    audio.play().catch(() => {
      setActiveAudioKey(null);
    });
    setActiveAudioKey(key);
  };

  return (
    <div className="flex-1 p-6 bg-black text-white overflow-y-auto">
      {data.map((item, i) => {
        const audioKey = `${item.surah.number}:${item.ayah.numberInSurah}`;

        return (
          <div key={`${audioKey}-${i}`} className="mb-6 border-b border-gray-800 pb-4">
            <p className="text-right text-2xl leading-loose font-arabic">
              {item.ayah.text}
            </p>

            <p className="text-gray-400 mt-2 text-sm">
              {item.ayah.translation?.text}
            </p>

            <button
              onClick={() => handlePlayPause(item)}
              className="mt-2 text-green-400 text-xs"
            >
              {activeAudioKey === audioKey ? "Pause Audio" : "Play Audio"}
            </button>

            <button className="ml-4 text-yellow-400 text-xs">Bookmark</button>
          </div>
        );
      })}
    </div>
  );
}
