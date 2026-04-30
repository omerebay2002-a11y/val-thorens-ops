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
  Settings2,
  Minus,
  Plus,
  RotateCcw,
  TrendingUp,
  Users,
  Layers,
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import ShareMenu from "@/components/shared/ShareMenu";
import { useApartmentData } from "@/hooks/useApartmentData";
import { useShoppingConfig } from "@/hooks/useShoppingConfig";
import { buildShoppingList, buildIssuesReport } from "@/lib/aggregators";
import { formatShoppingList } from "@/lib/whatsapp";
import { downloadShoppingListPDF } from "@/lib/pdf";
import {
  SHOPPING_KEY,
  KITCHEN_ITEMS_MULTIPLIER,
  DEFAULT_PER_PERSON,
} from "@/lib/data";
import toast from "react-hot-toast";

function PerPersonStepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white rounded-full border border-slate-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="p-1.5 text-brand-500 hover:bg-brand-50 transition-colors touch-feedback"
        aria-label="פחות"
      >
        <Minus size={12} strokeWidth={3} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
        }}
        className="w-8 text-center font-black tabular-nums text-sm bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="p-1.5 text-brand-500 hover:bg-brand-50 transition-colors touch-feedback"
        aria-label="עוד"
      >
        <Plus size={12} strokeWidth={3} />
      </button>
    </div>
  );
}

function ConfigPanel({ config, onUpdate, onReset, open, onToggle }) {
  return (
    <section className="bg-gradient-to-br from-brand-50 to-white rounded-2xl border-2 border-brand-100 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-right hover:bg-brand-50/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-soft">
            <Settings2 size={18} />
          </div>
          <div>
            <div className="font-black text-sm text-slate-800">
              הגדרות מגירת סכו"ם
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              כמה לאדם — משפיע על החישוב לכל הדירות
            </div>
          </div>
        </div>
        {open ? (
          <ChevronUp size={18} className="text-brand-500" />
        ) : (
          <ChevronDown size={18} className="text-brand-500" />
        )}
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-2 animate-slide-down">
          <div className="grid grid-cols-2 gap-2">
            {KITCHEN_ITEMS_MULTIPLIER.map((item) => {
              const value = config[item] ?? DEFAULT_PER_PERSON[item] ?? 2;
              const isDefault = value === (DEFAULT_PER_PERSON[item] ?? 2);
              return (
                <div
                  key={item}
                  className={`flex items-center justify-between bg-white rounded-xl px-3 py-2 border ${
                    isDefault ? "border-slate-100" : "border-brand-200"
                  }`}
                >
                  <span className="font-bold text-xs text-slate-700 truncate">
                    {item}
                  </span>
                  <PerPersonStepper
                    value={value}
                    onChange={(v) => onUpdate(item, v)}
                  />
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onReset}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl py-2.5 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={14} />
            איפוס לברירת מחדל (2 לאדם)
          </button>
        </div>
      )}
    </section>
  );
}

function StatsCard({ icon: Icon, label, value, sub, gradient }) {
  return (
    <div
      className={`rounded-2xl p-4 border border-slate-100 shadow-soft text-white ${gradient}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
          {label}
        </span>
        <Icon size={16} className="opacity-90" />
      </div>
      <div className="text-2xl font-black tabular-nums leading-tight">
        {value}
      </div>
      {sub && (
        <div className="text-[10px] font-bold opacity-80 mt-0.5">{sub}</div>
      )}
    </div>
  );
}

function TopItemsChart({ items }) {
  const top = items.slice(0, 5);
  if (top.length === 0) return null;
  const max = Math.max(...top.map((i) => i.totalShortage));

  return (
    <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={14} className="text-brand-500" />
          חוסרים מובילים
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Top 5
        </span>
      </div>
      <div className="space-y-2">
        {top.map((item, idx) => {
          const pct = (item.totalShortage / max) * 100;
          return (
            <div key={item.item} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-700 truncate flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[9px] font-black">
                    {idx + 1}
                  </span>
                  {item.item}
                </span>
                <span className="font-black tabular-nums text-slate-800">
                  {item.totalShortage}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function ShoppingListPage() {
  const { data, isLoaded } = useApartmentData();
  const { config, updatePerPerson, resetConfig } = useShoppingConfig();
  const [expanded, setExpanded] = useState({});
  const [bought, setBought] = useState({});
  const [configOpen, setConfigOpen] = useState(false);

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

  const items = useMemo(
    () => buildShoppingList(data, config),
    [data, config]
  );
  const issuesCount = useMemo(
    () => buildIssuesReport(data, config).length,
    [data, config]
  );

  const totalShortage = items.reduce((s, i) => s + i.totalShortage, 0);
  const remaining = items.filter((i) => !bought[i.item]).length;
  const totalApartments = useMemo(() => {
    const set = new Set();
    items.forEach((it) => it.apartments.forEach((a) => set.add(a.name)));
    return set.size;
  }, [items]);

  const completionPct =
    items.length > 0
      ? Math.round(((items.length - remaining) / items.length) * 100)
      : 100;

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
        {items.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-1 text-left">
              {completionPct}% הושלמו
            </div>
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        <ConfigPanel
          config={config}
          onUpdate={updatePerPerson}
          onReset={resetConfig}
          open={configOpen}
          onToggle={() => setConfigOpen((v) => !v)}
        />

        {items.length > 0 && (
          <>
            <section className="grid grid-cols-3 gap-2">
              <StatsCard
                icon={Layers}
                label="יחידות חסרות"
                value={totalShortage}
                gradient="bg-gradient-to-br from-rose-500 to-rose-600"
              />
              <StatsCard
                icon={PackageCheck}
                label="סוגי פריטים"
                value={items.length}
                sub={`${remaining} פתוחים`}
                gradient="bg-gradient-to-br from-brand-500 to-brand-600"
              />
              <StatsCard
                icon={Users}
                label="דירות מושפעות"
                value={totalApartments}
                gradient="bg-gradient-to-br from-amber-500 to-amber-600"
              />
            </section>

            <TopItemsChart items={items} />

            <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                  ייצא רשימה
                </div>
                <div className="text-sm font-bold text-slate-700">
                  {items.length} סוגים · {totalShortage} יחידות
                </div>
              </div>
              <ShareMenu
                title="רשימת קניות"
                text={formatShoppingList(items.filter((i) => !bought[i.item]))}
                onPDF={handlePDF}
                label="ייצא"
              />
            </section>
          </>
        )}

        {items.length === 0 ? (
          <EmptyState
            icon={PackageCheck}
            title="הרשימה ריקה 🎉"
            description="לא סומנו פריטים חסרים בדירות. עדכן את כמויות הציוד בכל דירה ואת ההגדרות למעלה."
          />
        ) : (
          <>
            <div className="space-y-2">
              {items.map((item) => {
                const isBought = !!bought[item.item];
                const isOpen = !!expanded[item.item];
                const tagLabel = item.isMultiplier
                  ? "סכו\"ם"
                  : item.isMin2
                  ? "מינ' 2"
                  : "סטטוס";
                const tagClass = item.isMultiplier
                  ? "bg-brand-100 text-brand-700"
                  : item.isMin2
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700";
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
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div
                              className={`font-black text-base ${
                                isBought ? "line-through text-slate-400" : "text-slate-800"
                              }`}
                            >
                              {item.item}
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${tagClass}`}
                            >
                              {tagLabel}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5">
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
                        {item.apartments.map((a, i) => {
                          const ratio =
                            a.required > 0 ? a.have / a.required : 0;
                          const barColor =
                            a.have === 0
                              ? "bg-rose-400"
                              : ratio < 1
                              ? "bg-amber-400"
                              : "bg-emerald-400";
                          return (
                            <div
                              key={i}
                              className="bg-white rounded-lg px-3 py-2 text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
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
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                                    {a.have}/{a.required}
                                  </span>
                                  <span
                                    className={`font-black px-2 py-0.5 rounded-full text-[10px] ${
                                      a.status === "missing"
                                        ? "bg-rose-100 text-rose-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    +{a.shortage}
                                  </span>
                                </div>
                              </div>
                              {a.required > 0 && (
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${barColor} transition-all duration-300`}
                                    style={{
                                      width: `${Math.min(100, ratio * 100)}%`,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
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
