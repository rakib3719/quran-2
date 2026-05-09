"use client";

import { useEffect, useState } from "react";
import Render from "./components/layout/Render";
import SidebarLeft from "./components/layout/SidebarLeft";
import SidebarRight from "./components/layout/SidebarRight";
import ReadingSettings from "./components/settings/ReadingSettings";
import { AppView, BookmarkItem, ReadingSettingsState, ReaderMode } from "@/types/reader";
import Topbar from "./components/layout/Topbar";
import BookmarkPage from "./components/bookmark/BookmarkPage";

const SETTINGS_KEY = "quran-reading-settings";
const BOOKMARK_KEY = "quran-bookmarks";
const THEME_KEY = "quran-theme";

const defaultSettings: ReadingSettingsState = {
  contentMode: "translation",
  arabicFontSize: 38,
  translationFontSize: 24,
  arabicFontFace: "kfgq",
};

export default function Home() {
  const [view, setView] = useState<AppView>("reader");
  const [mode, setMode] = useState<ReaderMode>("surah");
  const [id, setId] = useState(1);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (window.localStorage.getItem(THEME_KEY) as "dark" | "light") ?? "dark";
  });
  const [settings, setSettings] = useState<ReadingSettingsState>(() => {
    if (typeof window === "undefined") return defaultSettings;
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      return raw
        ? ({ ...defaultSettings, ...JSON.parse(raw) } as ReadingSettingsState)
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(BOOKMARK_KEY);
      return raw ? (JSON.parse(raw) as BookmarkItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const onModeChange = (nextMode: ReaderMode, nextId: number) => {
    setView("reader");
    setMode(nextMode);
    setId(nextId);
  };

  const onOpenAyah = (surahNumber: number, ayahNumberInSurah: number) => {
    setView("reader");
    setMode("surah");
    setId(surahNumber);
    window.location.hash = `${ayahNumberInSurah}`;
  };

  const onToggleBookmark = ({
    surahNumber,
    ayahNumberInSurah,
  }: {
    surahNumber: number;
    ayahNumberInSurah: number;
  }) => {
    const key = `${surahNumber}:${ayahNumberInSurah}`;
    setBookmarks((current) => {
      if (current.some((item) => item.key === key)) {
        return current.filter((item) => item.key !== key);
      }
      return [
        ...current,
        {
          key,
          surahNumber,
          ayahNumberInSurah,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  return (
<div className="flex">

  <SidebarLeft activeView={view} onNavigate={setView} />
      <div className="h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col overflow-hidden">
      {/* Top: full-width topbar */}
      <Topbar
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onSearchClick={() => setView("reader")}
      />

      {/* Bottom: sidebar + content row */}
      <div className="flex flex-1 overflow-hidden">
  

        <SidebarRight mode={mode} selectedId={id} onModeChange={onModeChange} query={query} onQueryChange={setQuery} />

        {view === "bookmark" ? (
          <BookmarkPage bookmarks={bookmarks} onOpenAyah={onOpenAyah} />
        ) : (
          <Render
            mode={mode}
            id={id}
            query={query}
            settings={settings}
            bookmarks={bookmarks}
            onToggleBookmark={onToggleBookmark}
          />
        )}

        <ReadingSettings settings={settings} onChange={setSettings} />
      </div>
    </div>
</div>
  );
}
