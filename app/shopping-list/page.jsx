"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  PackageCheck,
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import ShareMenu from "@/components/shared/ShareMenu";
import { useApartmentData } from "@/hooks/useApartmentData";
import { buildShoppingList, buildIssuesReport } from "@/lib/aggregators";
import { formatShoppingList } from "@/lib/whatsapp";
import { downloadShoppingListPDF } from "@/lib/pdf";
import { SHOPPING_KEY } from "@/lib/data";
import toast from "react-hot-toast";

export default function ShoppingListPage() {
  const { data, isLoaded } = useApartmentData();
  const [expanded, setExpanded] = useState({});
  const [bought, setBought] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(SHOPPING_KEY);
      if (saved) setBought(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(bought));
  }, [bought]);

  const items = useMemo(() => buildShoppingList(data), [data]);
  const issuesCount = useMemo(() => buildIssuesReport(data).length, [data]);

  const totalShortage = items.reduce((s, i) => s + i.totalShortage, 0);
  const remaining = items.filter((i) => !bought[i.item]).length;

  const handlePDF = () => {
    try {
      downloadShoppingListPDF(items.filter((i) => !bought[i.item]));
      toast.success("PDF הורד");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה ביצירת PDF");
    }
  };

  const toggleBought = (item) => {
    setBought((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleExpand = (item) => {
    setExpanded((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleClearBought = () => {
    setBought({});
    toast.success("הסימונים נוקו");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        טוען...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-30 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-soft-lg border-b-2 border-brand-500">
        <div className="max-w-2xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 bg-slate-700/60 rounded-lg hover:bg-slate-700 transition-colors touch-feedback"
              aria-label="חזרה"
            >
              <ArrowRight size={18} />
            </Link>
            <h1 className="text-lg font-black flex items-center gap-2">
              <ShoppingCart size={20} className="text-brand-400" />
              רשימת קניות
            </h1>
          </div>
          <div className="text-left">
            <div className="text-2xl font-black tabular-nums">{remaining}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">
              נותרו
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {items.length > 0 && (
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                סה"כ פריטים חסרים
              </div>
              <div className="text-2xl font-black text-slate-800 tabular-nums">
                {totalShortage}{" "}
                <span className="text-sm font-bold text-slate-500">
                  ({items.length} סוגים)
                </span>
              </div>
            </div>
            <ShareMenu
              title="רשימת קניות"
              text={formatShoppingList(items.filter((i) => !bought[i.item]))}
              onPDF={handlePDF}
              label="ייצא"
            />
          </section>
        )}

        {items.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="הרשימה ריקה 🎉"
            description="לא סומנו פריטים חסרים בדירות. כשתסמן פריט כ'חסר' או 'חלקי', הוא יופיע כאן אוטומטית."
          />
        ) : (
          <>
            <div className="space-y-2">
              {items.map((item) => {
                const isBought = !!bought[item.item];
                const isOpen = !!expanded[item.item];
                return (
                  <article
                    key={item.item}
                    className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                      isBought ? "border-emerald-200 opacity-60" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => toggleBought(item.item)}
                        className="p-4 flex-shrink-0 touch-feedback"
                        aria-label={isBought ? "סמן כלא נקנה" : "סמן כנקנה"}
                      >
                        {isBought ? (
                          <CheckCircle2
                            size={26}
                            className="text-emerald-500"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Circle size={26} className="text-slate-300" strokeWidth={2} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.item)}
                        className="flex-1 py-4 pr-2 pl-4 flex items-center justify-between text-right"
                      >
                        <div>
                          <div
                            className={`font-black text-base ${
                              isBought ? "line-through text-slate-400" : "text-slate-800"
                            }`}
                          >
                            {item.item}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            חסר {item.totalShortage} • {item.apartments.length} דירות
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={18} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={18} className="text-slate-400" />
                        )}
                      </button>
                    </div>
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-3 space-y-1.5 animate-slide-down">
                        {item.apartments.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="font-bold text-slate-700 truncate">
                                {a.name}
                              </span>
                              {a.note && (
                                <span className="text-slate-500 italic truncate">
                                  — {a.note}
                                </span>
                              )}
                            </div>
                            <span
                              className={`font-black px-2 py-0.5 rounded-full text-[10px] ${
                                a.status === "missing"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {a.shortage}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {Object.values(bought).some(Boolean) && (
              <button
                type="button"
                onClick={handleClearBought}
                className="w-full py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                נקה סימוני "נקנה"
              </button>
            )}
          </>
        )}
      </main>

      <BottomNav shoppingCount={items.length} issuesCount={issuesCount} />
    </div>
  );
}
