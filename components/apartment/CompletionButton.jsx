"use client";

import { Lock, Unlock, RotateCcw } from "lucide-react";

export default function CompletionButton({ completed, isExitComplete, onToggle }) {
  const disabled = !completed && !isExitComplete;

  return (
    <div className="space-y-3 pt-2">
      {!isExitComplete && !completed && (
        <div className="flex items-center justify-center gap-2 text-amber-700 text-xs font-bold bg-amber-50 border border-amber-200 rounded-xl py-2 px-3 animate-pulse-soft">
          <Lock size={14} />
          השלם את צ&apos;ק-ליסט העזיבה כדי לסיים
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-soft-lg flex items-center justify-center gap-3 touch-feedback ${
          disabled
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : completed
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
        }`}
      >
        {completed ? (
          <>
            <RotateCcw size={20} />
            פתח דירה מחדש
          </>
        ) : (
          <>
            סיים בדיקה וסגור דירה
            {isExitComplete ? <Unlock size={20} /> : <Lock size={20} />}
          </>
        )}
      </button>
    </div>
  );
}
