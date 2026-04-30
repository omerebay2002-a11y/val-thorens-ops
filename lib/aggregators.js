import {
  APARTMENT_LIST,
  isMultiplierItem,
  isMin2Item,
  isQuantityItem,
  getRequiredQuantity,
  EXIT_CHECKLIST,
  KITCHEN_ITEMS_MULTIPLIER,
  KITCHEN_ITEMS_MIN2,
  MIN2_REQUIRED,
} from "./data";

function quantityShortage(item, count, capacity, config) {
  const required = getRequiredQuantity(item, capacity, config);
  const have = Number.isFinite(count) ? count : 0;
  return Math.max(0, required - have);
}

export function countApartmentShortages(apt, data, config) {
  if (!data) return 0;
  let count = 0;
  KITCHEN_ITEMS_MULTIPLIER.forEach((item) => {
    if (quantityShortage(item, data.counts?.[item], apt.cap, config) > 0) count++;
  });
  KITCHEN_ITEMS_MIN2.forEach((item) => {
    if (quantityShortage(item, data.counts?.[item], apt.cap, config) > 0) count++;
  });
  return count;
}

export function buildShoppingList(apartmentData, config) {
  const items = {};

  function ensure(item) {
    if (!items[item]) {
      items[item] = {
        item,
        isMultiplier: isMultiplierItem(item),
        isMin2: isMin2Item(item),
        totalShortage: 0,
        apartments: [],
      };
    }
    return items[item];
  }

  APARTMENT_LIST.forEach((apt) => {
    const data = apartmentData[apt.name];
    if (!data) return;

    // Quantity-based items (cutlery + min2)
    [...KITCHEN_ITEMS_MULTIPLIER, ...KITCHEN_ITEMS_MIN2].forEach((item) => {
      const have = Number.isFinite(data.counts?.[item]) ? data.counts[item] : 0;
      const required = getRequiredQuantity(item, apt.cap, config);
      const shortage = Math.max(0, required - have);
      if (shortage <= 0) return;

      const entry = ensure(item);
      entry.totalShortage += shortage;
      entry.apartments.push({
        name: apt.name,
        cap: apt.cap,
        status: "missing",
        required,
        have,
        shortage,
        note: data.checks?.[item]?.note || "",
      });
    });

    // Status-based items (appliances + non-kitchen categories)
    Object.entries(data.checks || {}).forEach(([item, check]) => {
      if (isQuantityItem(item)) return;
      if (check.status !== "missing" && check.status !== "partial") return;

      const required = 1;
      const shortage = check.status === "missing" ? required : Math.ceil(required / 2);
      const entry = ensure(item);
      entry.totalShortage += shortage;
      entry.apartments.push({
        name: apt.name,
        cap: apt.cap,
        status: check.status,
        required,
        have: 0,
        shortage,
        note: check.note || "",
      });
    });
  });

  return Object.values(items).sort((a, b) => b.totalShortage - a.totalShortage);
}

export function buildIssuesReport(apartmentData, config) {
  const issues = [];

  APARTMENT_LIST.forEach((apt) => {
    const data = apartmentData[apt.name];
    if (!data) return;

    const hasRenovation = data.renovationText?.trim() || data.photos?.length > 0;

    const missingQuantity = [];
    [...KITCHEN_ITEMS_MULTIPLIER, ...KITCHEN_ITEMS_MIN2].forEach((item) => {
      const have = Number.isFinite(data.counts?.[item]) ? data.counts[item] : 0;
      const required = getRequiredQuantity(item, apt.cap, config);
      const shortage = Math.max(0, required - have);
      if (shortage > 0) {
        missingQuantity.push({
          item,
          status: have === 0 ? "missing" : "partial",
          note: data.checks?.[item]?.note || "",
          have,
          required,
          shortage,
        });
      }
    });

    const missingStatus = Object.entries(data.checks || {})
      .filter(
        ([item, c]) =>
          !isQuantityItem(item) &&
          (c.status === "missing" || c.status === "partial")
      )
      .map(([item, c]) => ({ item, status: c.status, note: c.note }));

    const missingItems = [...missingStatus, ...missingQuantity];

    if (hasRenovation || missingItems.length > 0) {
      issues.push({
        apartment: apt,
        renovationText: data.renovationText || "",
        photos: data.photos || [],
        priority: data.priority || "med",
        missingItems,
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

export function getApartmentStatus(data, configOrApt, maybeConfig) {
  // Backwards compatible: getApartmentStatus(data) | (data, config) | (data, apt, config)
  let apt = null;
  let config = null;
  if (configOrApt && typeof configOrApt === "object" && "cap" in configOrApt) {
    apt = configOrApt;
    config = maybeConfig || null;
  } else {
    config = configOrApt || null;
  }

  if (!data) return "untouched";
  if (data.completed) return "done";

  const hasStatusIssues = Object.entries(data.checks || {}).some(
    ([item, c]) =>
      !isQuantityItem(item) && (c.status === "missing" || c.status === "partial")
  );

  let hasQuantityIssues = false;
  KITCHEN_ITEMS_MIN2.forEach((item) => {
    const have = data.counts?.[item];
    if (have === undefined) return;
    if (have < MIN2_REQUIRED) hasQuantityIssues = true;
  });

  if (apt) {
    KITCHEN_ITEMS_MULTIPLIER.forEach((item) => {
      const have = data.counts?.[item];
      if (have === undefined) return;
      const required = getRequiredQuantity(item, apt.cap, config);
      if (have < required) hasQuantityIssues = true;
    });
  }

  const hasIssues =
    data.renovationText?.trim() ||
    data.photos?.length > 0 ||
    hasStatusIssues ||
    hasQuantityIssues;
  if (hasIssues) return "issues";

  const hasAnyCheck =
    Object.keys(data.checks || {}).length > 0 ||
    Object.keys(data.counts || {}).length > 0 ||
    Object.values(data.exitChecks || {}).some(Boolean);
  if (hasAnyCheck) return "in_progress";

  return "untouched";
}

export function getGlobalStats(apartmentData, config) {
  const total = APARTMENT_LIST.length;
  let done = 0;
  let inProgress = 0;
  let withIssues = 0;
  let totalPhotos = 0;
  let totalMissing = 0;

  APARTMENT_LIST.forEach((apt) => {
    const data = apartmentData[apt.name];
    const status = getApartmentStatus(data, apt, config);
    if (status === "done") done++;
    else if (status === "in_progress") inProgress++;
    if (status === "issues") withIssues++;

    totalPhotos += data?.photos?.length || 0;

    // Quantity shortages
    if (data) {
      [...KITCHEN_ITEMS_MULTIPLIER, ...KITCHEN_ITEMS_MIN2].forEach((item) => {
        if (quantityShortage(item, data.counts?.[item], apt.cap, config) > 0) {
          totalMissing++;
        }
      });
      Object.entries(data.checks || {}).forEach(([item, c]) => {
        if (isQuantityItem(item)) return;
        if (c.status === "missing" || c.status === "partial") totalMissing++;
      });
    }
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
