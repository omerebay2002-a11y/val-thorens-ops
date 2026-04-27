"use client";

import { Wrench, Flag } from "lucide-react";
import PhotoGrid from "@/components/shared/PhotoGrid";
import VoiceRecorder from "@/components/shared/VoiceRecorder";

const PRIORITIES = [
  { key: "low", label: "נמוכה", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { key: "med", label: "בינונית", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { key: "high", label: "גבוהה", color: "bg-rose-100 text-rose-700 border-rose-300" },
];

export default function RenovationSection({
  text,
  priority,
  photos,
  onTextChange,
  onPriorityChange,
  onAddPhoto,
  onRemovePhoto,
}) {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 space-y-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider">
          <Wrench size={16} />
          שיפוץ ותיקונים
        </h4>
        <div className="flex items-center gap-1">
          <Flag size={12} className="text-slate-400" />
          {PRIORITIES.map((p) => {
            const isActive = priority === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onPriorityChange(p.key)}
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-all touch-feedback ${
                  isActive
                    ? p.color + " scale-105 shadow-sm"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text || ""}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="תאר מה דורש טיפול... (או לחץ על המיקרופון להקלטה)"
          className="w-full p-3 pl-14 text-sm rounded-xl border border-amber-200 bg-white min-h-[100px] outline-none shadow-sm focus:ring-2 focus:ring-amber-300 transition-all resize-none"
        />
        <div className="absolute left-2 top-2">
          <VoiceRecorder onTranscript={onTextChange} currentText={text || ""} />
        </div>
      </div>

      <PhotoGrid photos={photos || []} onAdd={onAddPhoto} onRemove={onRemovePhoto} />
    </section>
  );
}
