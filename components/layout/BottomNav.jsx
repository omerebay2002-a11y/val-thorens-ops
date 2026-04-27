"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, LayoutDashboard } from "lucide-react";

const NAV = [
  { href: "/", label: "דירות", icon: Home },
  { href: "/dashboard", label: "תקלות", icon: LayoutDashboard },
  { href: "/shopping-list", label: "קניות", icon: ShoppingCart },
];

export default function BottomNav({ shoppingCount = 0, issuesCount = 0 }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 safe-bottom">
      <div className="max-w-2xl mx-auto px-4 py-2 flex justify-around">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const badge =
            item.href === "/shopping-list"
              ? shoppingCount
              : item.href === "/dashboard"
              ? issuesCount
              : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-black">{item.label}</span>
              {badge > 0 && (
                <span className="absolute top-0 left-2 bg-rose-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
