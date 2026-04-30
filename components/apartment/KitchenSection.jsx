"use client";

import { Utensils, Zap, Minus, Plus, Check, AlertTriangle } from "lucide-react";
import CheckButton from "@/components/shared/CheckButton";
import {
  KITCHEN_ITEMS_MULTIPLIER,
  KITCHEN_ITEMS_MIN2,
  KITCHEN_ITEMS_STATUS,
  isMultiplierItem,
  isMin2Item,
  getRequiredQuantity,
  MIN2_REQUIRED,
} from "@/lib/data";
import { useShoppingConfig } from "@/hooks/useShoppingConfig";

function QuantityStepper({ value, required, onChange }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const ratio = required > 0 ? safeValue / required : 1;
  const tone =
    safeValue === 0
      ? "bg-rose-50 border-rose-200 text-rose-700"
      : ratio < 1
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-emerald-50 border-emerald-200 text-emerald-700";

  const Icon = safeValue === 0 ? AlertTriangle : ratio < 1 ? AlertTriangle : Check;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${tone}`}
      >
        <Icon size={10} />
        {safeValue}/{required}
      </div>
      <div className="flex items-center gap-1 bg-white rounded-full border border-slate-200 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, safeValue - 1))}
          className="p-2 text-brand-500 hover:bg-brand-50 transition-colors touch-feedback"
          aria-label="פחות"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={safeValue}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
          }}
          className="w-10 text-center font-black tabular-nums text-base bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(safeValue + 1)}
          className="p-2 text-brand-500 hover:bg-brand-50 transition-colors touch-feedback"
          aria-label="עוד"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function QuantityRow({ item, count, required, ratio, onChange }) {
  const safeCount = Number.isFinite(count) ? count : 0;
  const pct = required > 0 ? Math.min(100, (safeCount / required) * 100) : 100;
  const barColor =
    safeCount === 0
      ? "bg-rose-400"
      : pct < 100
      ? "bg-amber-400"
      : "bg-emerald-400";

  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2.5">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-bold text-sm text-slate-700 truncate">{item}</span>
          <span className="text-[11px] font-black text-brand-500 tabular-nums">
            ({required})
          </span>
        </div>
        <QuantityStepper value={safeCount} required={required} onChange={onChange} />
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatusRow({ item, check, onUpdateCheck }) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm text-slate-700">{item}</span>
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
          onChange={(e) => onUpdateCheck(item, check.status, e.target.value)}
          className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:border-brand-400 transition-colors"
        />
      )}
    </div>
  );
}

export default function KitchenSection({
  apt,
  checks,
  counts,
  onUpdateCheck,
  onUpdateCount,
}) {
  const { config } = useShoppingConfig();

  const markAllOk = () => {
    KITCHEN_ITEMS_STATUS.forEach((item) => onUpdateCheck(item, "ok"));
    KITCHEN_ITEMS_MULTIPLIER.forEach((item) => {
      const required = getRequiredQuantity(item, apt.cap, config);
      onUpdateCount(item, required);
    });
    KITCHEN_ITEMS_MIN2.forEach((item) => onUpdateCount(item, MIN2_REQUIRED));
  };

  return (
    <section className="space-y-4">
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

      <div className="space-y-3">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-1">
          מגירת סכו"ם
        </div>
        <div className="space-y-2">
          {KITCHEN_ITEMS_MULTIPLIER.map((item) => {
            const required = getRequiredQuantity(item, apt.cap, config);
            return (
              <QuantityRow
                key={item}
                item={item}
                count={counts?.[item] ?? 0}
                required={required}
                onChange={(v) => onUpdateCount(item, v)}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-1">
          מטבח — מינימום {MIN2_REQUIRED}
        </div>
        <div className="space-y-2">
          {KITCHEN_ITEMS_MIN2.map((item) => (
            <QuantityRow
              key={item}
              item={item}
              count={counts?.[item] ?? 0}
              required={MIN2_REQUIRED}
              onChange={(v) => onUpdateCount(item, v)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-1">
          מכשירים ופריטים
        </div>
        <div className="space-y-2">
          {KITCHEN_ITEMS_STATUS.map((item) => {
            const check = checks?.[item] || { status: "none", note: "" };
            return (
              <StatusRow
                key={item}
                item={item}
                check={check}
                onUpdateCheck={onUpdateCheck}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
