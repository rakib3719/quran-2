export type ReaderMode = "surah" | "juz" | "page";
export type AppView = "reader" | "bookmark";

export type ContentMode = "translation" | "reading";

export interface ReadingSettingsState {
  contentMode: ContentMode;
  arabicFontSize: number;
  translationFontSize: number;
  arabicFontFace: "kfgq" | "amiri" | "scheherazade";
}

export interface BookmarkItem {
  key: string;
  surahNumber: number;
  ayahNumberInSurah: number;
  createdAt: string;
}
