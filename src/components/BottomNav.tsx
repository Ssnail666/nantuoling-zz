"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", icon: "⌂" },
  { href: "/post", label: "发布", icon: "＋" },
  { href: "/my", label: "我的", icon: "◦" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl items-center justify-around px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-3">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === item.href || pathname.startsWith("/item/")
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`tap-active flex min-w-[88px] flex-col items-center gap-1 rounded-2xl px-4 py-2 text-sm transition ${
                active ? "bg-moss text-white" : "text-stone-500"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
