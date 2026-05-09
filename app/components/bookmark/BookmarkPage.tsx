"use client";

import quran from "@/data/quran.json";
import { BookmarkItem } from "@/types/reader";
import { Surah } from "@/types/quran";

const surahs = quran as Surah[];

type Props = {
  bookmarks: BookmarkItem[];
  onOpenAyah: (surahNumber: number, ayahNumberInSurah: number) => void;
};

export default function BookmarkPage({ bookmarks, onOpenAyah }: Props) {
  const sorted = [...bookmarks].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <main className="flex-1 bg-[var(--panel)] text-[var(--fg)] overflow-y-auto px-4 md:px-10 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--fg)]">Bookmarks</h2>
        <p className="text-[var(--text-soft)] mt-2 text-sm">Saved ayahs from your reading journey.</p>
        <div className="mt-8 space-y-3">
          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-[#1f341c] bg-[var(--panel)] p-6 text-[var(--text-soft)]">
              No bookmark yet.
            </div>
          ) : (
            sorted.map((item) => {
              const surah = surahs.find((s) => s.number === item.surahNumber);
              const ayah = surah?.ayahs.find((a) => a.numberInSurah === item.ayahNumberInSurah);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onOpenAyah(item.surahNumber, item.ayahNumberInSurah)}
                  className="w-full text-left rounded-2xl border border-[#1f341c] bg-[var(--panel)] p-4 hover:bg-[var(--card-bg)] hover:border-[#35563f] transition-colors"
                >
                  <p className="text-[#42a34f] text-xs font-semibold">
                    {item.surahNumber}:{item.ayahNumberInSurah}
                  </p>
                  <p className="text-base font-semibold mt-2">{surah?.englishName?.replace("-", " ") ?? "Unknown Surah"}</p>
                  <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2">{ayah?.translation?.text ?? ayah?.text ?? "Ayah preview unavailable"}</p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
