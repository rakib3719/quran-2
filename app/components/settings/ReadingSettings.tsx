"use client";

import { ReadingSettingsState } from "@/types/reader";

type Props = {
  settings: ReadingSettingsState;
  onChange: (next: ReadingSettingsState) => void;
};

export default function ReadingSettings({
  settings,
  onChange,
}: Props) {
  return (
    <aside className="hidden xl:flex w-[360px] shrink-0 border-l border-[#1f341c] bg-[var(--panel)] text-[var(--fg)] flex-col">
      {/* Top Tabs */}
      <div className="p-5 border-b border-[#1b221a] shrink-0">
        <div className="bg-[var(--input-bg)] rounded-full p-1 grid grid-cols-2 gap-1">
          <button
            onClick={() =>
              onChange({
                ...settings,
                contentMode: "translation",
              })
            }
            className={`h-11 rounded-full text-[15px] font-medium transition-colors ${
              settings.contentMode === "translation"
                ? "bg-[var(--chip-bg)] text-[var(--fg)]"
                : "text-[var(--text-soft)]"
            }`}
          >
            Translation
          </button>

          <button
            onClick={() =>
              onChange({
                ...settings,
                contentMode: "reading",
              })
            }
            className={`h-11 rounded-full text-[15px] font-medium transition-colors ${
              settings.contentMode === "reading"
                ? "bg-[var(--chip-bg)] text-[var(--fg)]"
                : "text-[var(--text-soft)]"
            }`}
          >
            Reading
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className="
          flex-1
          overflow-y-auto
          p-5
          space-y-6

          scrollbar-thin
          scrollbar-track-[#0b0d11]
          scrollbar-thumb-[#1f5f2d]
        "
      >
        {/* Heading */}
        <div>
          <p className="text-[28px] font-bold text-[var(--fg)]">
            Reading Settings
          </p>

          <p className="text-[var(--text-soft)] text-[14px] mt-1">
            Customize your Quran reading experience
          </p>
        </div>

        {/* Font Settings Card */}
        <div className="rounded-2xl border border-[#1f341c] bg-[var(--card-bg)] p-5">
          <p className="text-[#4fa84f] text-[18px] font-semibold mb-5">
            Font Settings
          </p>

          {/* Arabic Font Size */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] font-medium text-[var(--text-muted)]">
                Arabic Font Size
              </p>

              <p className="text-[#4fa84f] text-[15px] font-semibold">
                {settings.arabicFontSize}
              </p>
            </div>

            <input
              type="range"
              min={22}
              max={54}
              value={settings.arabicFontSize}
              onChange={(e) =>
                onChange({
                  ...settings,
                  arabicFontSize: Number(e.target.value),
                })
              }
              className="slider w-full"
            />
          </div>

          {/* Translation Font Size */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[15px] font-medium text-[var(--text-muted)]">
                Translation Font Size
              </p>

              <p className="text-[#4fa84f] text-[15px] font-semibold">
                {settings.translationFontSize}
              </p>
            </div>

            <input
              type="range"
              min={13}
              max={30}
              value={settings.translationFontSize}
              onChange={(e) =>
                onChange({
                  ...settings,
                  translationFontSize: Number(e.target.value),
                })
              }
              className="slider w-full"
            />
          </div>

          {/* Font Face */}
          <div>
            <p className="text-[15px] font-medium text-[var(--text-muted)] mb-3">
              Arabic Font Face
            </p>

            <select
              value={settings.arabicFontFace}
              onChange={(e) =>
                onChange({
                  ...settings,
                  arabicFontFace:
                    e.target.value as ReadingSettingsState["arabicFontFace"],
                })
              }
              className="
                w-full
                h-12
                rounded-xl
                bg-[var(--input-bg)]
                border border-[var(--border-soft)]
                px-4
                text-[15px]
                text-[var(--fg)]
                outline-none
              "
            >
              <option value="kfgq">KFGQ</option>
              <option value="amiri">Amiri</option>
              <option value="scheherazade">
                Scheherazade
              </option>
            </select>
          </div>
        </div>

        {/* Support Card */}
        <div className="rounded-2xl border border-[#1f341c] bg-[var(--card-bg)] p-5">
          <p className="text-[22px] leading-snug font-bold text-[var(--fg)]">
            Help spread the knowledge of Islam
          </p>

          <p className="text-[var(--text-soft)] text-[14px] mt-3 leading-6">
            Your support helps us improve Quran learning
            for المسلمين around the world.
          </p>

          <button
            className="
              mt-5
              h-11
              w-full
              rounded-xl
              bg-[#428038]
              hover:bg-[#4d9442]
              transition-colors
              text-[15px]
              font-semibold
            "
          >
            Support Us
          </button>
        </div>
      </div>
    </aside>
  );
}
