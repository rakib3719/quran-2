"use client";

import { useEffect, useMemo, useRef } from "react";
import quran from "@/data/quran.json";
import { Surah } from "@/types/quran";
import { ReaderMode } from "@/types/reader";

type Props = {
  mode: ReaderMode;
  selectedId: number;
  onModeChange: (mode: ReaderMode, id: number) => void;
  query: string;
  onQueryChange: (value: string) => void;
};

const surahs = quran as Surah[];

const juzSummary = Array.from({ length: 30 }, (_, i) => {
  const juz = i + 1;

  const inJuz = surahs.filter((surah) =>
    surah.ayahs.some((ayah) => ayah.juz === juz)
  );

  return {
    juz,
    surahCount: inJuz.length,
    first: inJuz[0],
  };
});

export default function SidebarRight({
  mode,
  selectedId,
  onModeChange,
  query,
  onQueryChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = () => inputRef.current?.focus();
    window.addEventListener("focus-reader-search", handler as EventListener);
    return () => window.removeEventListener("focus-reader-search", handler as EventListener);
  }, []);

  const filteredSurahs = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return surahs;

    return surahs.filter((surah) =>
      [
        surah.englishName,
        surah.englishNameTranslation,
        surah.number.toString(),
        surah.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [query]);

  const filteredJuz = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return juzSummary;

    return juzSummary.filter((item) => {
      const firstName = item.first?.englishName ?? "";
      const translation = item.first?.englishNameTranslation ?? "";
      return `${item.juz} juz para ${firstName} ${translation}`.toLowerCase().includes(term);
    });
  }, [query]);

  const filteredPages = useMemo(() => {
    const term = query.trim();

    const pages = Array.from({ length: 604 }, (_, i) => i + 1);

    if (!term) return pages;

    return pages.filter((p) => p.toString().includes(term));
  }, [query]);

  return (
    <aside
      className="
        w-full md:w-[335px]
        h-screen
        shrink-0
        border-r border-[var(--border-soft)]
        bg-[var(--panel)]
        text-[var(--fg)]
        flex flex-col
      "
    >
      {/* Fixed Top */}
      <div className="shrink-0">
        {/* <div className="p-5 border-b border-[#1b1f26]">
          <h1 className="text-[40px] leading-none font-bold tracking-tight text-[#dbdde2]">
            Quran Mazid
          </h1>

          <p className="text-[#6f7580] text-sm mt-1">
            Read, Study, and Learn The Quran
          </p>
        </div> */}

        <div className="p-5 pb-4">
          <div className="bg-[var(--input-bg)] rounded-full p-1 grid grid-cols-3 gap-1 text-sm mb-4">
            {(["surah", "juz", "page"] as ReaderMode[]).map((item) => (
              <button
                key={item}
                onClick={() => onModeChange(item, 1)}
                className={`h-10 rounded-full capitalize transition-colors ${
                  mode === item
                    ? "bg-[var(--chip-bg)] text-[var(--fg)]"
                    : "text-[var(--text-soft)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={`Search ${mode}`}
            className="w-full h-12 rounded-full bg-[var(--input-bg)] border border-[var(--border-soft)] px-4 text-[var(--fg)] placeholder:text-[var(--text-soft)] outline-none"
          />
        </div>
      </div>

      {/* Scrollable List Only */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-5 pb-5
          space-y-3

          scrollbar-thin
          scrollbar-track-[#0b0d11]
          scrollbar-thumb-[#1f5f2d]
          hover:scrollbar-thumb-[#2d7d3d]
        "
      >
        {mode === "surah" &&
          filteredSurahs.map((surah) => (
            <button
              type="button"
              key={surah.number}
              onClick={() => onModeChange("surah", surah.number)}
              className={`w-full  text-left rounded-2xl border p-4 transition-colors ${
                selectedId === surah.number
                  ? "bg-[var(--card-bg)] border-[#1f341c]"
                  : "bg-[var(--panel)] border-[#1f341c] hover:border-[#35563f] hover:bg-[var(--card-bg)]"
              }`}
            >

              
              <div className="flex items-center justify-between gap-3">
                <div>
               <section className="flex  items-center gap-4">
                 <div className="relative h-8 w-8 shrink-0">
  {/* Rotated Background */}
  <div className="absolute inset-0 rotate-45 rounded bg-[#428038]" />

  {/* Number */}
  <div className="relative z-10 flex h-full w-full items-center justify-center text-white text-sm font-medium">
    {surah.number}
  </div>
</div>
                 <div>
                   <p className="text-[15px] font-semibold">
                    {surah.englishName.replace("-", " ")}
                  </p>

                  <p className="text-[var(--text-soft)] text-[13px]">
                    {surah.englishNameTranslation}
                  </p>
                 </div>
               </section>
                </div>

              
              </div>
            </button>
          ))}

      {mode === "juz" &&
  filteredJuz.map((item) => (
    <button
      type="button"
      key={item.juz}
      onClick={() => onModeChange("juz", item.juz)}
      className={`w-full text-left rounded-2xl border p-4 transition-colors ${
        selectedId === item.juz
          ? "bg-[var(--card-bg)] border-[#1f341c]"
          : "bg-[var(--panel)] border-[#1f341c] hover:border-[#35563f] hover:bg-[var(--card-bg)]"
      }`}
    >
      <section className="flex items-center gap-4">
        {/* Diamond */}
        <div className="relative h-8 w-8 shrink-0">
          <div className="absolute inset-0 rotate-45 rounded bg-[#428038]" />

          <div className="relative z-10 flex h-full w-full items-center justify-center text-white text-sm font-medium">
            {item.juz}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-[15px] font-semibold">
            Juz {item.juz}
          </p>

          <p className="text-[var(--text-soft)] text-[13px]">
            {item.first?.englishName ?? "Surah"} & More
          </p>
        </div>
      </section>
    </button>
  ))}

{mode === "page" &&
  filteredPages.map((pageNumber) => (
    <button
      type="button"
      key={pageNumber}
      onClick={() => onModeChange("page", pageNumber)}
      className={`w-full text-left rounded-2xl border p-4 transition-colors ${
        selectedId === pageNumber
          ? "bg-[var(--card-bg)] border-[#1f341c]"
          : "bg-[var(--panel)] border-[#1f341c] hover:border-[#35563f] hover:bg-[var(--card-bg)]"
      }`}
    >
      <section className="flex items-center gap-4">
        {/* Diamond */}
        <div className="relative h-8 w-8 shrink-0">
          <div className="absolute inset-0 rotate-45 rounded bg-[#428038]" />

          <div className="relative z-10 flex h-full w-full items-center justify-center text-white text-sm font-medium">
            {pageNumber}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-[15px] font-semibold">
            Page {String(pageNumber).padStart(2, "0")}
          </p>

          <p className="text-[var(--text-soft)] text-[13px]">
            Quran Page Navigation
          </p>
        </div>
      </section>
    </button>
  ))}
      </div>
    </aside>
  );
}
