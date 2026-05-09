"use client";

import type { ComponentType } from "react";
import type { AppView } from "@/types/reader";
import {
  Home,
  LayoutGrid,
  Compass,
  Bookmark,
  Grid2x2,
} from "lucide-react";

const menuItems: { label: string; icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; view: AppView }[] = [
  {
    label: "Home",
    icon: Home,
    view: "reader",
  },
  {
    label: "Grid",
    icon: LayoutGrid,
    view: "reader",
  },
  {
    label: "Explore",
    icon: Compass,
    view: "reader",
  },
  {
    label: "Bookmark",
    icon: Bookmark,
    view: "bookmark",
  },
  {
    label: "Apps",
    icon: Grid2x2,
    view: "reader",
  },
];

type Props = {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
};

export default function SidebarLeft({ activeView, onNavigate }: Props) {
  return (
    <aside className="hidden md:flex w-16 shrink-0 flex-col items-center bg-[var(--panel)] border-r border-[var(--border-soft)] py-4">
      {/* Logo */}
      <div className="h-10 w-10 rounded-xl bg-[#4b9b47] flex items-center justify-center shadow-[0_0_20px_rgba(75,155,71,0.35)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-5 h-5"
        >
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L18.74 8 12 11.8 5.26 8 12 4.2zm-7 5.1l6 3.3v7.2l-6-3.3V9.3zm8 10.5v-7.2l6-3.3v7.2l-6 3.3z" />
        </svg>
      </div>

      {/* Menu */}
      <nav className="mt-20 flex flex-col items-center gap-8 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.view)}
              aria-label={item.label}
              title={item.label}
              className="
                group
                relative
                flex
                items-center
                justify-center
                text-[#8a8f98] 
                hover:text-white
                transition-all
              "
            >
              <Icon
                size={21}
                strokeWidth={1.8}
                className={`transition-transform duration-200 group-hover:scale-110 ${activeView === item.view && item.label === "Bookmark" ? "text-white" : ""}`}
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
