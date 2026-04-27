"use client";

import { CheckCircle2, Circle, LogOut } from "lucide-react";
import { EXIT_CHECKLIST } from "@/lib/data";

export default function ExitChecklist({ exitChecks, onToggle }) {
  return (
    <section className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-soft-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 p-2 opacity-10">
        <LogOut size={60} />
      </div>
      <header className="relative z-10">
        <h4 className="flex items-center gap-2 text-sm font-black text-brand-400">
          <LogOut size={18} />
          עזיבת דירה — שלב סגירה
        </h4>
        <p className="text-[11px] text-slate-400 font-medium mt-1">
          סמן את כל הפעולות כדי לאפשר סגירת דירה
        </p>
      </header>
      <div className="space-y-2 relative z-10">
        {EXIT_CHECKLIST.map((item) => {
          const checked = !!exitChecks?.[item];
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all touch-feedback ${
                checked
                  ? "bg-brand-600 border-brand-400 shadow-md scale-[1.02]"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span className="text-xs font-bold">{item}</span>
              {checked ? (
                <CheckCircle2 size={18} />
              ) : (
                <Circle size={18} className="opacity-40" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
