"use client";

const FILTERS = [
  { key: "all", label: "הכל" },
  { key: "untouched", label: "חדשות" },
  { key: "in_progress", label: "בתהליך" },
  { key: "issues", label: "תקלות" },
  { key: "done", label: "סגורות" },
];

export default function FilterChips({ active, onChange, counts }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        const count = counts?.[f.key] ?? 0;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap touch-feedback flex-shrink-0 ${
              isActive
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
            <span
              className={`text-[10px] font-black px-1.5 rounded-full ${
                isActive ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
