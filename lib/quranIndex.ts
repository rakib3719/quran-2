import quran from "@/data/quran.json";
import { Surah } from "@/types/quran";

const surahs = quran as Surah[];

/**
 * SURAH MAP (direct)
 */
export const getSurah = (id: number) => {
  return surahs.find((s) => s.number === id);
};

/**
 * JUZ INDEX
 */
export const getJuz = (juz: number) => {
  const result: { surah: Surah; ayahIndex: number }[] = [];

  surahs.forEach((surah) => {
    surah.ayahs.forEach((ayah, i) => {
      if (ayah.juz === juz) {
        result.push({ surah, ayahIndex: i });
      }
    });
  });

  return result;
};

/**
 * PAGE INDEX
 */
export const getPage = (page: number) => {
  const result: { surah: Surah; ayahIndex: number }[] = [];

  surahs.forEach((surah) => {
    surah.ayahs.forEach((ayah, i) => {
      if (ayah.page === page) {
        result.push({ surah, ayahIndex: i });
      }
    });
  });

  return result;
};