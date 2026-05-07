"use client";

import { useEffect, useState } from "react";
import { getSurah, getJuz, getPage } from "@/lib/quranIndex";

export default function Render() {
  const [mode, setMode] = useState<"surah" | "juz" | "page">("surah");
  const [id, setId] = useState<number>(1);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (mode === "surah") {
      const surah = getSurah(id);
      setData(surah ? surah.ayahs.map((a) => ({ ...a, surah })) : []);
    }

    if (mode === "juz") {
      setData(getJuz(id));
    }

    if (mode === "page") {
      setData(getPage(id));
    }
  }, [mode, id]);

  return (
    <div className="flex-1 p-6 bg-black text-white overflow-y-auto">
      {data.map((item, i) => (
        <div key={i} className="mb-6 border-b border-gray-800 pb-4">
          <p className="text-right text-2xl leading-loose font-arabic">
            {item.text}
          </p>

          <p className="text-gray-400 mt-2 text-sm">
            {item.translation?.text}
          </p>

          {/* Audio Button (future API hook) */}
          <button className="mt-2 text-green-400 text-xs">
            ▶ Play Audio
          </button>

          {/* Bookmark */}
          <button className="ml-4 text-yellow-400 text-xs">
            🔖 Bookmark
          </button>
        </div>
      ))}
    </div>
  );
}