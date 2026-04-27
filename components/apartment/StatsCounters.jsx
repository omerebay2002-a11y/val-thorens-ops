"use client";

import { Bed, Key, MinusCircle, PlusCircle } from "lucide-react";

function Counter({ icon: Icon, label, value, onChange }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-200 text-center shadow-inner">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1 mb-2">
        <Icon size={12} />
        {label}
      </label>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="text-brand-500 bg-white p-1 rounded-full shadow-sm touch-feedback"
          aria-label="פחות"
        >
          <MinusCircle size={22} />
        </button>
        <span className="font-black text-2xl w-8 tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="text-brand-500 bg-white p-1 rounded-full shadow-sm touch-feedback"
          aria-label="עוד"
        >
          <PlusCircle size={22} />
        </button>
      </div>
    </div>
  );
}

export default function StatsCounters({ doubleBeds, keys, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Counter
        icon={Bed}
        label="מיטות זוגיות"
        value={doubleBeds || 0}
        onChange={(v) => onChange("doubleBeds", v)}
      />
      <Counter
        icon={Key}
        label="מפתחות"
        value={keys || 0}
        onChange={(v) => onChange("keys", v)}
      />
    </div>
  );
}
