import { APARTMENT_LIST, STORAGE_KEY } from "./data";

export function buildInitialData() {
  const initial = {};
  APARTMENT_LIST.forEach((apt) => {
    initial[apt.name] = {
      doubleBeds: apt.defaultDouble,
      keys: 0,
      checks: {},
      exitChecks: {},
      photos: [],
      renovationText: "",
      priority: "med",
      completed: false,
      lastChecked: null,
    };
  });
  return initial;
}

export function loadData() {
  if (typeof window === "undefined") return buildInitialData();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return buildInitialData();

    const parsed = JSON.parse(saved);
    const merged = buildInitialData();
    APARTMENT_LIST.forEach((apt) => {
      if (parsed[apt.name]) {
        merged[apt.name] = { ...merged[apt.name], ...parsed[apt.name] };
      }
    });
    return merged;
  } catch (e) {
    console.error("Failed to load data:", e);
    return buildInitialData();
  }
}

export function saveData(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}

export function exportToJSON(data) {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `val_thorens_backup_${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const merged = buildInitialData();
        APARTMENT_LIST.forEach((apt) => {
          if (parsed[apt.name]) {
            merged[apt.name] = { ...merged[apt.name], ...parsed[apt.name] };
          }
        });
        resolve(merged);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
