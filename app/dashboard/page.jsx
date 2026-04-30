"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Wrench,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import ProgressRing from "@/components/ui/ProgressRing";
import ShareMenu from "@/components/shared/ShareMenu";
import { useApartmentData } from "@/hooks/useApartmentData";
import {
  buildIssuesReport,
  getGlobalStats,
  buildShoppingList,
} from "@/lib/aggregators";
import { formatGlobalIssuesReport } from "@/lib/whatsapp";
import { downloadIssuesPDF } from "@/lib/pdf";
import toast from "react-hot-toast";

const PRIORITY_STYLES = {
  high: { ring: "ring-rose-300", badge: "bg-rose-500", label: "גבוהה" },
  med: { ring: "ring-amber-300", badge: "bg-amber-500", label: "בינונית" },
  low: { ring: "ring-emerald-300", badge: "bg-emerald-500", label: "נמוכה" },
};

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-soft`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <Icon size={16} className={color} />
      </div>
      <div className="text-2xl font-black text-slate-800 tabular-nums">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoaded } = useApartmentData();

  const stats = useMemo(() => getGlobalStats(data), [data]);
  const issues = useMemo(() => buildIssuesReport(data), [data]);
  const shoppingCount = useMemo(() => buildShoppingList(data).length, [data]);

  const handlePDF = () => {
    try {
      downloadIssuesPDF(issues);
      toast.success("PDF הורד");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה ביצירת PDF");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        טוען...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-30 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-soft-lg border-b-2 border-brand-500">
        <div className="max-w-2xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 bg-slate-700/60 rounded-lg hover:bg-slate-700 transition-colors touch-feedback"
              aria-label="חזרה"
            >
              <ArrowRight size={18} />
            </Link>
            <h1 className="text-lg font-black flex items-center gap-2">
              <LayoutDashboard size={20} className="text-brand-400" />
              דשבורד תקלות
            </h1>
          </div>
          <ProgressRing
            value={stats.done}
            max={stats.total}
            size={44}
            stroke={4}
            color="#a5b4fc"
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-5">
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            label="סך דירות"
            value={stats.total}
            color="text-slate-400"
            icon={Sparkles}
          />
          <StatCard
            label="הושלמו"
            value={stats.done}
            color="text-emerald-500"
            icon={CheckCircle2}
          />
          <StatCard
            label="עם תקלות"
            value={stats.withIssues}
            color="text-amber-500"
            icon={AlertTriangle}
          />
          <StatCard
            label="תמונות שיפוץ"
            value={stats.totalPhotos}
            color="text-rose-500"
            icon={Camera}
          />
        </section>

        {issues.length > 0 && (
          <section className="flex justify-between items-center">
            <h2 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Wrench size={16} className="text-brand-500" />
              תקלות פתוחות ({issues.length})
            </h2>
            <ShareMenu
              title="דוח תקלות"
              text={formatGlobalIssuesReport(issues)}
              onPDF={handlePDF}
              label="ייצא דוח"
            />
          </section>
        )}

        {issues.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="אין תקלות פתוחות 🎉"
            description="כל הדירות במצב טוב — או שעדיין לא נבדקו"
          />
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => {
              const style = PRIORITY_STYLES[issue.priority] || PRIORITY_STYLES.med;
              return (
                <article
                  key={issue.apartment.name}
                  className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-soft ring-1 ${style.ring}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-slate-800">
                        {issue.apartment.name}
                      </h3>
                      <span
                        className={`${style.badge} text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full`}
                      >
                        {style.label}
                      </span>
                      {issue.completed && (
                        <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                          סגורה
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/?apt=${encodeURIComponent(issue.apartment.name)}`}
                      className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
                    >
                      פתח →
                    </Link>
                  </div>

                  {issue.missingItems.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[11px] font-black uppercase text-slate-500 mb-1.5">
                        חוסרים ({issue.missingItems.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {issue.missingItems.slice(0, 8).map((m, i) => (
                          <span
                            key={i}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              m.status === "missing"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                            title={m.note}
                          >
                            {m.item}
                          </span>
                        ))}
                        {issue.missingItems.length > 8 && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            +{issue.missingItems.length - 8}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {issue.renovationText && (
                    <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-100 mb-3 whitespace-pre-wrap">
                      {issue.renovationText}
                    </p>
                  )}

                  {issue.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
                      {issue.photos.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt=""
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-slate-200"
                        />
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav shoppingCount={shoppingCount} issuesCount={issues.length} />
    </div>
  );
}
