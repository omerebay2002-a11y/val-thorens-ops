import {
  APARTMENT_LIST,
  isMultiplierItem,
  getRequiredQuantity,
  EXIT_CHECKLIST,
  getAllCheckableItems,
} from "./data";

export function buildShoppingList(apartmentData) {
  const items = {};

  APARTMENT_LIST.forEach((apt) => {
    const data = apartmentData[apt.name];
    if (!data?.checks) return;

    Object.entries(data.checks).forEach(([item, check]) => {
      if (check.status !== "missing" && check.status !== "partial") return;

      if (!items[item]) {
        items[item] = {
          item,
          isMultiplier: isMultiplierItem(item),
          totalShortage: 0,
          apartments: [],
        };
      }

      const required = getRequiredQuantity(item, apt.cap);
      const shortage = check.status === "missing" ? required : Math.ceil(required / 2);

      items[item].totalShortage += shortage;
      items[item].apartments.push({
        name: apt.name,
        cap: apt.cap,
        status: check.status,
        required,
        shortage,
        note: check.note || "",
      });
    });
  });

  return Object.values(items).sort((a, b) => b.totalShortage - a.totalShortage);
}

export function buildIssuesReport(apartmentData) {
  const issues = [];

  APARTMENT_LIST.forEach((apt) => {
    const data = apartmentData[apt.name];
    if (!data) return;

    const hasRenovation = data.renovationText?.trim() || data.photos?.length > 0;
    const missingItems = Object.entries(data.checks || {}).filter(
      ([, c]) => c.status === "missing" || c.status === "partial"
    );

    if (hasRenovation || missingItems.length > 0) {
      issues.push({
        apartment: apt,
        renovationText: data.renovationText || "",
        photos: data.photos || [],
        priority: data.priority || "med",
        missingItems: missingItems.map(([item, c]) => ({
          item,
          status: c.status,
          note: c.note,
        })),
        completed: data.completed,
        lastChecked: data.lastChecked,
      });
    }
  });

  const priorityOrder = { high: 0, med: 1, low: 2 };
  return issues.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

export function getApartmentStatus(data) {
  if (!data) return "untouched";
  if (data.completed) return "done";

  const hasIssues =
    data.renovationText?.trim() ||
    data.photos?.length > 0 ||
    Object.values(data.checks || {}).some(
      (c) => c.status === "missing" || c.status === "partial"
    );
  if (hasIssues) return "issues";

  const hasAnyCheck =
    Object.keys(data.checks || {}).length > 0 ||
    Object.values(data.exitChecks || {}).some(Boolean);
  if (hasAnyCheck) return "in_progress";

  return "untouched";
}

export function getGlobalStats(apartmentData) {
  const total = APARTMENT_LIST.length;
  let done = 0;
  let inProgress = 0;
  let withIssues = 0;
  let totalPhotos = 0;
  let totalMissing = 0;

  APARTMENT_LIST.forEach((apt) => {
    const data = apartmentData[apt.name];
    const status = getApartmentStatus(data);
    if (status === "done") done++;
    else if (status === "in_progress") inProgress++;
    if (status === "issues") withIssues++;

    totalPhotos += data?.photos?.length || 0;
    totalMissing += Object.values(data?.checks || {}).filter(
      (c) => c.status === "missing" || c.status === "partial"
    ).length;
  });

  return {
    total,
    done,
    inProgress,
    withIssues,
    untouched: total - done - inProgress - withIssues,
    totalPhotos,
    totalMissing,
    progressPct: Math.round((done / total) * 100),
  };
}

export function isExitComplete(data) {
  if (!data?.exitChecks) return false;
  return EXIT_CHECKLIST.every((item) => data.exitChecks[item]);
}
