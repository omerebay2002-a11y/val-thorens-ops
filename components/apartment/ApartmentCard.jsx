"use client";

import { useState } from "react";
import {
  Home,
  Users,
  Bed,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import StatsCounters from "./StatsCounters";
import KitchenSection from "./KitchenSection";
import CategorySection from "./CategorySection";
import RenovationSection from "./RenovationSection";
import ExitChecklist from "./ExitChecklist";
import CompletionButton from "./CompletionButton";
import ShareMenu from "@/components/shared/ShareMenu";
import { CATEGORIES, isQuantityItem } from "@/lib/data";
import {
  isExitComplete,
  getApartmentStatus,
  countApartmentShortages,
} from "@/lib/aggregators";
import { useShoppingConfig } from "@/hooks/useShoppingConfig";
import { formatApartmentReport } from "@/lib/whatsapp";
import { downloadApartmentPDF } from "@/lib/pdf";
import toast from "react-hot-toast";

function formatRelativeTime(timestamp) {
  if (!timestamp) return null;
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "כעת";
  if (min < 60) return `לפני ${min} דק'`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `לפני ${hr} שע'`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `לפני ${day} ימים`;
  return new Date(timestamp).toLocaleDateString("he-IL");
}

const STATUS_BADGES = {
  done: { label: "סגורה", color: "bg-emerald-500", icon: CheckCircle2 },
  issues: { label: "תקלות", color: "bg-amber-500", icon: AlertTriangle },
  in_progress: { label: "בתהליך", color: "bg-brand-500", icon: Clock },
  untouched: null,
};

export default function ApartmentCard({
  apt,
  data,
  onUpdateField,
  onUpdateCheck,
  onUpdateCount,
  onToggleExitCheck,
  onAddPhoto,
  onRemovePhoto,
  expanded,
  onToggleExpand,
}) {
  const { config } = useShoppingConfig();
  const exitDone = isExitComplete(data);
  const status = getApartmentStatus(data, apt, config);
  const statusBadge = STATUS_BADGES[status];
  const lastCheckedText = formatRelativeTime(data.lastChecked);

  const statusIssues = Object.entries(data.checks || {}).filter(
    ([item, c]) =>
      !isQuantityItem(item) && (c.status === "missing" || c.status === "partial")
  ).length;
  const quantityIssues = countApartmentShortages(apt, data, config);
  const issuesCount = statusIssues + quantityIssues;

  const cardClass = data.completed
    ? "border-emerald-400 bg-emerald-50/30"
    : expanded
    ? "border-brand-400 shadow-soft-lg"
    : status === "issues"
    ? "border-amber-200"
    : "border-slate-100 shadow-soft";

  const handleShare = () => formatApartmentReport(apt, data, config);

  const handlePDF = () => {
    try {
      downloadApartmentPDF(apt, data, config);
      toast.success("PDF הורד");
    } catch (e) {
      toast.error("שגיאה ביצירת PDF");
      console.error(e);
    }
  };

  return (
    <article
      className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${cardClass}`}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full p-4 flex items-center justify-between cursor-pointer text-right ${
          expanded ? "bg-brand-50/40" : ""
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
              data.completed
                ? "bg-emerald-500 text-white rotate-3"
                : status === "issues"
                ? "bg-amber-100 text-amber-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Home size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`font-black text-base leading-tight ${
                  data.completed ? "text-emerald-700" : "text-slate-800"
                }`}
              >
                {apt.name}
              </h3>
              {statusBadge && (
                <span
                  className={`inline-flex items-center gap-1 ${statusBadge.color} text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full`}
                >
                  <statusBadge.icon size={10} />
                  {statusBadge.label}
                </span>
              )}
            </div>
            <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
              <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                <Users size={10} />
                {apt.cap}
              </span>
              {data.doubleBeds > 0 && (
                <span className="flex items-center gap-1 text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">
                  <Bed size={10} />
                  {data.doubleBeds}
                </span>
              )}
              {issuesCount > 0 && !data.completed && (
                <span className="flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  <AlertTriangle size={10} />
                  {issuesCount} חוסרים
                </span>
              )}
              {lastCheckedText && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {lastCheckedText}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {expanded ? (
            <ChevronUp className="text-brand-500" />
          ) : (
            <ChevronDown className="text-slate-300" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 border-t border-slate-100 space-y-6 bg-white animate-slide-down">
          <div className="flex justify-end">
            <ShareMenu
              title={apt.name}
              text={formatApartmentReport(apt, data, config)}
              onPDF={handlePDF}
              label="שתף דירה"
            />
          </div>

          <StatsCounters
            doubleBeds={data.doubleBeds}
            keys={data.keys}
            onChange={(field, value) => onUpdateField(apt.name, field, value)}
          />

          <KitchenSection
            apt={apt}
            checks={data.checks}
            counts={data.counts}
            onUpdateCheck={(item, status, note) =>
              onUpdateCheck(apt.name, item, status, note)
            }
            onUpdateCount={(item, count) =>
              onUpdateCount(apt.name, item, count)
            }
          />

          {Object.entries(CATEGORIES).map(([cat, items]) => (
            <CategorySection
              key={cat}
              category={cat}
              items={items}
              checks={data.checks}
              onUpdateCheck={(item, status) =>
                onUpdateCheck(apt.name, item, status)
              }
            />
          ))}

          <RenovationSection
            text={data.renovationText}
            priority={data.priority}
            photos={data.photos}
            onTextChange={(v) => onUpdateField(apt.name, "renovationText", v)}
            onPriorityChange={(v) => onUpdateField(apt.name, "priority", v)}
            onAddPhoto={(url) => onAddPhoto(apt.name, url)}
            onRemovePhoto={(i) => onRemovePhoto(apt.name, i)}
          />

          <ExitChecklist
            exitChecks={data.exitChecks}
            onToggle={(item) => onToggleExitCheck(apt.name, item)}
          />

          <CompletionButton
            completed={data.completed}
            isExitComplete={exitDone}
            onToggle={() => {
              onUpdateField(apt.name, "completed", !data.completed);
              if (!data.completed) {
                toast.success(`${apt.name} נסגרה ✅`);
                onToggleExpand();
              } else {
                toast(`${apt.name} פתוחה לעריכה`, { icon: "🔓" });
              }
            }}
          />
        </div>
      )}
    </article>
  );
}
