"use client";

import { Utensils, Zap } from "lucide-react";
import CheckButton from "@/components/shared/CheckButton";
import {
  KITCHEN_ITEMS_MULTIPLIER,
  KITCHEN_ITEMS_FIXED,
  isMultiplierItem,
  getRequiredQuantity,
} from "@/lib/data";

export default function KitchenSection({ apt, checks, onUpdateCheck }) {
  const items = [...KITCHEN_ITEMS_MULTIPLIER, ...KITCHEN_ITEMS_FIXED];

  const markAllOk = () => {
    items.forEach((item) => onUpdateCheck(item, "ok"));
  };

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
        <h4 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
          <Utensils size={14} className="text-brand-500" />
          ציוד מטבח
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
      <div className="space-y-2">
        {items.map((item) => {
          const isMul = isMultiplierItem(item);
          const required = getRequiredQuantity(item, apt.cap);
          const check = checks?.[item] || { status: "none", note: "" };
          return (
            <div
              key={item}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-700">
                  {item}
                  {isMul && (
                    <span className="text-brand-500 font-black mr-1">
                      ({required})
                    </span>
                  )}
                </span>
                <CheckButton
                  status={check.status}
                  onChange={(s) => onUpdateCheck(item, s, check.note)}
                />
              </div>
              {(check.status === "missing" || check.status === "partial") && (
                <input
                  type="text"
                  placeholder="הערה (אופציונלי)..."
                  value={check.note || ""}
                  onChange={(e) =>
                    onUpdateCheck(item, check.status, e.target.value)
                  }
                  className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:border-brand-400 transition-colors"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
