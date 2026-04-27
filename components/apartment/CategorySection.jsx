"use client";

import { CheckCircle2, Circle, Bath, Layout, Settings, Zap } from "lucide-react";

const CATEGORY_ICONS = {
  "פינת אוכל": Layout,
  "שירותים": Bath,
  "כללי חדר": Settings,
};

export default function CategorySection({ category, items, checks, onUpdateCheck }) {
  const Icon = CATEGORY_ICONS[category] || Settings;

  const markAllOk = () => {
    items.forEach((item) => onUpdateCheck(item, "ok"));
  };

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
        <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
          <Icon size={14} className="text-brand-500" />
          {category}
        </h4>
        <button
          type="button"
          onClick={markAllOk}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors touch-feedback"
        >
          <Zap size={12} />
          הכל תקין
        </button>
      </header>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const check = checks?.[item] || { status: "none" };
          const isOk = check.status === "ok";
          return (
            <button
              key={item}
              type="button"
              onClick={() =>
                onUpdateCheck(item, isOk ? "none" : "ok")
              }
              className={`p-3 rounded-xl border-2 text-right text-xs font-bold transition-all flex items-center gap-2 touch-feedback ${
                isOk
                  ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm"
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
              }`}
            >
              {isOk ? (
                <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0" />
              ) : (
                <Circle size={16} className="opacity-30 flex-shrink-0" />
              )}
              <span className="truncate">{item}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
