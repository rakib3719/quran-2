"use client";

import {
  Home,
  LayoutGrid,
  Compass,
  Bookmark,
  Grid2x2,
} from "lucide-react";

const menuItems = [
  {
    label: "Home",
    icon: Home,
  },
  {
    label: "Grid",
    icon: LayoutGrid,
  },
  {
    label: "Explore",
    icon: Compass,
  },
  {
    label: "Bookmark",
    icon: Bookmark,
  },
  {
    label: "Apps",
    icon: Grid2x2,
  },
];

export default function SidebarLeft() {
  return (
    <aside className="hidden md:flex w-16 shrink-0 flex-col items-center bg-[#0d0d0d] border-r border-[#1f222a] py-4">
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
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}