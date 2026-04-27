"use client";

import { Check, AlertTriangle, X } from "lucide-react";

const STATES = {
  ok: {
    label: "תקין",
    icon: Check,
    activeClass: "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200",
  },
  partial: {
    label: "חלקי",
    icon: AlertTriangle,
    activeClass: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200",
  },
  missing: {
    label: "חסר",
    icon: X,
    activeClass: "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200",
  },
};

export default function CheckButton({ status, onChange }) {
  return (
    <div className="flex gap-1.5">
      {Object.entries(STATES).map(([key, conf]) => {
        const Icon = conf.icon;
        const isActive = status === key;
        return (
          <button
            key={key}
            type="button"
            aria-label={conf.label}
            onClick={() => onChange(isActive ? "none" : key)}
            className={`p-2 rounded-xl border-2 transition-all touch-feedback ${
              isActive
                ? conf.activeClass + " scale-105"
                : "bg-white text-slate-300 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Icon size={16} strokeWidth={3} />
          </button>
        );
      })}
    </div>
  );
}
