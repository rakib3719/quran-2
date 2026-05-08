"use client";

import { useState } from "react";
import quran from "@/data/quran.json";
import { Surah } from "@/types/quran";

type Tab = "surah" | "juz" | "page";

export default function SidebarRight({
  onSelectSurah,
  onSelectJuz,
  onSelectPage,
}: {
  onSelectSurah: (id: number) => void;
  onSelectJuz: (juz: number) => void;
  onSelectPage: (page: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("surah");

  const surahs = quran as Surah[];

  return (
    <div className="w-80 h-screen border-r bg-[#0f172a] text-white overflow-y-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {["surah", "juz", "page"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as Tab)}
            className={`flex-1 p-2 text-sm ${
              tab === t ? "bg-green-600" : ""
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SURAH LIST */}
      {tab === "surah" && (
        <div>
          {surahs.map((s) => (
            <div
              key={s.number}
              onClick={() => onSelectSurah(s.number)}
              className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800"
            >
              <p className="text-sm">
                {s.number}. {s.englishName}
              </p>
              <p className="text-xs text-gray-400">{s.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* JUZ */}
      {tab === "juz" && (
        <div className="grid grid-cols-3 p-2 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelectJuz(i + 1)}
              className="p-2 bg-gray-800 rounded"
            >
              Juz {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* PAGE */}
      {tab === "page" && (
        <div className="grid grid-cols-4 p-2 gap-2">
          {Array.from({ length: 604 }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelectPage(i + 1)}
              className="p-1 text-xs bg-gray-800 rounded"
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}