"use client";

import { useMemo, useState } from "react";
import quran from "@/data/quran.json";
import { Surah } from "@/types/quran";
import { ReaderMode } from "@/types/reader";

type Props = {
  mode: ReaderMode;
  selectedId: number;
  onModeChange: (mode: ReaderMode, id: number) => void;
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
}: Props) {
  const [query, setQuery] = useState("");

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

    return juzSummary.filter((item) =>
      `juz ${item.juz}`.includes(term)
    );
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
        border-r border-[#1f222a]
        bg-[#0d0d0d]
        text-white
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
          <div className="bg-[#171717] rounded-full p-1 grid grid-cols-3 gap-1 text-sm mb-4">
            {(["surah", "juz", "page"] as ReaderMode[]).map((item) => (
              <button
                key={item}
                onClick={() => onModeChange(item, 1)}
                className={`h-10 rounded-full capitalize transition-colors ${
                  mode === item
                    ? "bg-[#090b10] text-white"
                    : "text-[#8a9099]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${mode}`}
            className="w-full h-12 rounded-full bg-[#171717] border border-[#262b33] px-4 text-[#d5d9df] placeholder:text-[#666d76] outline-none"
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
                  ? "bg-[#111510] border-[#1f341c]"
                  : "bg-[#0d0d0d] border-[#1f341c] hover:border-[#35563f] hover:bg-[#111510]"
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

                  <p className="text-[#7d8490] text-[13px]">
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
          ? "bg-[#111510] border-[#1f341c]"
          : "bg-[#0d0d0d] border-[#1f341c] hover:border-[#35563f] hover:bg-[#111510]"
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

          <p className="text-[#7d8490] text-[13px]">
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
          ? "bg-[#111510] border-[#1f341c]"
          : "bg-[#0d0d0d] border-[#1f341c] hover:border-[#35563f] hover:bg-[#111510]"
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

          <p className="text-[#7d8490] text-[13px]">
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