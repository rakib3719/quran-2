"use client";

import { ReadingSettingsState } from "@/types/reader";

type Props = {
  settings: ReadingSettingsState;
  onChange: (next: ReadingSettingsState) => void;
};

export default function ReadingSettings({ settings, onChange }: Props) {
  return (
    <aside className="hidden xl:block w-[360px] shrink-0 border-l border-[#1f222a] bg-[#090b0f] text-white overflow-y-auto">
      <div className="p-6 border-b border-[#1c2027]">
        <div className="h-11 rounded-full bg-[#151920] p-1 grid grid-cols-2 gap-1 text-lg">
          <button
            onClick={() => onChange({ ...settings, contentMode: "translation" })}
            className={`rounded-full transition-colors ${
              settings.contentMode === "translation" ? "bg-[#090b10] font-semibold" : "text-[#818793]"
            }`}
          >
            Translation
          </button>
          <button
            onClick={() => onChange({ ...settings, contentMode: "reading" })}
            className={`rounded-full transition-colors ${
              settings.contentMode === "reading" ? "bg-[#090b10] font-semibold" : "text-[#818793]"
            }`}
          >
            Reading
          </button>
        </div>
      </div>

      <div className="p-6 space-y-7">
        <div>
          <p className="text-3xl font-semibold text-[#cfd2d8]">Reading Settings</p>
        </div>

        <div>
          <p className="text-[#45a851] font-semibold text-2xl mb-4">Font Settings</p>

          <div className="mb-5">
            <div className="flex justify-between text-lg mb-2">
              <p className="text-[#cfd2d8]">Arabic Font Size</p>
              <p className="text-[#45a851]">{settings.arabicFontSize}</p>
            </div>
            <input
              type="range"
              min={22}
              max={54}
              value={settings.arabicFontSize}
              onChange={(e) => onChange({ ...settings, arabicFontSize: Number(e.target.value) })}
              className="slider w-full"
            />
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-lg mb-2">
              <p className="text-[#cfd2d8]">Translation Font Size</p>
              <p className="text-[#45a851]">{settings.translationFontSize}</p>
            </div>
            <input
              type="range"
              min={13}
              max={30}
              value={settings.translationFontSize}
              onChange={(e) =>
                onChange({ ...settings, translationFontSize: Number(e.target.value) })
              }
              className="slider w-full"
            />
          </div>

          <div>
            <p className="text-lg text-[#cfd2d8] mb-2">Arabic Font Face</p>
            <select
              value={settings.arabicFontFace}
              onChange={(e) =>
                onChange({
                  ...settings,
                  arabicFontFace: e.target.value as ReadingSettingsState["arabicFontFace"],
                })
              }
              className="w-full h-12 rounded-xl bg-[#161a20] border border-[#252a32] px-4 text-lg"
            >
              <option value="kfgq">KFGQ</option>
              <option value="amiri">Amiri</option>
              <option value="scheherazade">Scheherazade</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-[#22452a] bg-[#0f2013] p-5">
          <p className="text-3xl font-semibold">Help spread the knowledge of Islam</p>
          <p className="text-[#9ca3af] text-lg mt-3">
            Your regular support helps us reach our brothers and sisters with Quran learning.
          </p>
          <button className="mt-4 w-full h-11 rounded-xl bg-[#4c9f45] font-semibold text-lg">
            Support Us
          </button>
        </div>
      </div>
    </aside>
  );
}
