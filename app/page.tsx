"use client";
import { useState } from "react";
import SidebarRight from "./components/layout/SidebarRight";
import Render from "./components/layout/Render";

export default function Home() {
  const [mode, setMode] = useState<"surah" | "juz" | "page">("surah");
  const [id, setId] = useState(1);

  return (
    <div className="flex h-screen">
      <SidebarRight
        onSelectSurah={(id) => {
          setMode("surah");
          setId(id);
        }}
        onSelectJuz={(id) => {
          setMode("juz");
          setId(id);
        }}
        onSelectPage={(id) => {
          setMode("page");
          setId(id);
        }}
      />

      <Render mode={mode} id={id} />
    </div>
  );
}
