"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import FilterChips from "@/components/layout/FilterChips";
import BottomNav from "@/components/layout/BottomNav";
import ApartmentCard from "@/components/apartment/ApartmentCard";
import EmptyState from "@/components/ui/EmptyState";
import { useApartmentData } from "@/hooks/useApartmentData";
import { APARTMENT_LIST } from "@/lib/data";
import {
  getApartmentStatus,
  getGlobalStats,
  buildShoppingList,
  buildIssuesReport,
} from "@/lib/aggregators";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const {
    data,
    isLoaded,
    updateField,
    updateCheck,
    toggleExitCheck,
    addPhoto,
    removePhoto,
    replaceAllData,
  } = useApartmentData();

  const stats = useMemo(() => getGlobalStats(data), [data]);

  const counts = useMemo(() => {
    const c = { all: APARTMENT_LIST.length, untouched: 0, in_progress: 0, issues: 0, done: 0 };
    APARTMENT_LIST.forEach((a) => {
      const s = getApartmentStatus(data[a.name]);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [data]);

  const shoppingCount = useMemo(() => buildShoppingList(data).length, [data]);
  const issuesCount = useMemo(() => buildIssuesReport(data).length, [data]);

  const filtered = useMemo(() => {
    return APARTMENT_LIST.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "all") return true;
      return getApartmentStatus(data[a.name]) === filter;
    });
  }, [data, search, filter]);

  useEffect(() => {
    if (expandedId) {
      const exists = APARTMENT_LIST.find((a) => a.name === expandedId);
      if (!exists || !filtered.find((a) => a.name === expandedId)) {
        setExpandedId(null);
      }
    }
  }, [filtered, expandedId]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        טוען...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <AppHeader
        search={search}
        onSearch={setSearch}
        stats={stats}
        onImport={replaceAllData}
        data={data}
      />

      <div className="max-w-2xl mx-auto px-4 pt-4">
        <FilterChips active={filter} onChange={setFilter} counts={counts} />
      </div>

      <main className="max-w-2xl mx-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="לא נמצאו דירות"
            description={
              search
                ? `אין תוצאות עבור "${search}"`
                : "נסה לשנות את הסינון"
            }
          />
        ) : (
          filtered.map((apt) => (
            <ApartmentCard
              key={apt.name}
              apt={apt}
              data={data[apt.name] || {}}
              onUpdateField={updateField}
              onUpdateCheck={updateCheck}
              onToggleExitCheck={toggleExitCheck}
              onAddPhoto={addPhoto}
              onRemovePhoto={removePhoto}
              expanded={expandedId === apt.name}
              onToggleExpand={() =>
                setExpandedId((id) => (id === apt.name ? null : apt.name))
              }
            />
          ))
        )}
      </main>

      <BottomNav shoppingCount={shoppingCount} issuesCount={issuesCount} />
    </div>
  );
}
