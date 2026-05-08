"use client";

const menuItems = ["Home", "Grid", "Explore", "Bookmark", "Apps"];

export default function SidebarLeft() {
  return (
    <aside className="hidden md:flex w-16 shrink-0 flex-col items-center bg-[#121418] border-r border-[#1f222a] py-4 gap-8">
      <div className="h-10 w-10 rounded-xl bg-[#4b9b47] grid place-items-center text-white font-bold text-lg">
        Q
      </div>

      <nav className="mt-8 flex flex-col gap-7 text-[#8a8f98] text-[11px]">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className="h-8 w-8 rounded-lg border border-transparent hover:border-[#2d323c] hover:text-white transition-colors"
            aria-label={item}
            title={item}
          >
            {item.slice(0, 1)}
          </button>
        ))}
      </nav>
    </aside>
  );
}
