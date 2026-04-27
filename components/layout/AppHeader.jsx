"use client";

import { useRef } from "react";
import {
  ClipboardCheck,
  Search,
  Download,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import ProgressRing from "@/components/ui/ProgressRing";
import { exportToJSON, importFromJSON } from "@/lib/storage";

export default function AppHeader({ search, onSearch, stats, onImport, data }) {
  const fileRef = useRef(null);

  const handleExport = () => {
    exportToJSON(data);
    toast.success("הגיבוי הורד");
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newData = await importFromJSON(file);
      onImport(newData);
      toast.success("הגיבוי שוחזר בהצלחה");
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בקריאת הקובץ");
    }
    e.target.value = "";
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-soft-lg border-b-2 border-brand-500">
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <div className="flex justify-between items-center gap-3">
          <h1 className="text-lg font-black flex items-center gap-2 tracking-tight">
            <ClipboardCheck size={22} className="text-brand-400" />
            VAL THORENS OPS
          </h1>
          <div className="flex items-center gap-3">
            <ProgressRing
              value={stats.done}
              max={stats.total}
              size={44}
              stroke={4}
              color="#a5b4fc"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleImportClick}
                className="p-2 bg-slate-700/60 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors touch-feedback"
                aria-label="ייבא גיבוי"
                title="ייבא גיבוי"
              >
                <Upload size={16} />
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="p-2 bg-slate-700/60 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors touch-feedback"
                aria-label="הורד גיבוי"
                title="הורד גיבוי"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
          <input
            type="search"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 pr-10 pl-4 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="חפש דירה..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 gap-2">
          <span>
            <span className="text-emerald-400 font-black">{stats.done}</span>
            <span className="text-slate-500"> / {stats.total} </span>
            הושלמו
          </span>
          {stats.withIssues > 0 && (
            <span className="text-amber-400">⚠️ {stats.withIssues} עם תקלות</span>
          )}
          {stats.totalMissing > 0 && (
            <span className="text-rose-400">❌ {stats.totalMissing} חוסרים</span>
          )}
        </div>

        <input
          type="file"
          ref={fileRef}
          accept="application/json"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>
    </header>
  );
}
