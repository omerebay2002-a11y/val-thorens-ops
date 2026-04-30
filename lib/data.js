export const APARTMENT_LIST = [
  { name: "Olympiades 112", cap: 2, defaultDouble: 1 },
  { name: "Neves 194", cap: 6, defaultDouble: 0 },
  { name: "La Vanoise 473", cap: 3, defaultDouble: 1 },
  { name: "Neves 67", cap: 5, defaultDouble: 0 },
  { name: "Altineige 28", cap: 5, defaultDouble: 0 },
  { name: "Glaciers 7", cap: 5, defaultDouble: 0 },
  { name: "Glaciers 31", cap: 4, defaultDouble: 0 },
  { name: "Machu 801", cap: 5, defaultDouble: 0 },
  { name: "Machu 803", cap: 5, defaultDouble: 0 },
  { name: "Pichu 408", cap: 5, defaultDouble: 0 },
  { name: "Cusco H26", cap: 6, defaultDouble: 0 },
  { name: "Machu 603", cap: 5, defaultDouble: 0 },
  { name: "Altineige 208", cap: 4, defaultDouble: 0 },
  { name: "Altineige 203", cap: 5, defaultDouble: 0 },
  { name: "Le Sérac J10", cap: 2, defaultDouble: 2 },
  { name: "Dome de Polset 315", cap: 3, defaultDouble: 0 },
  { name: "Cime De Caron 1304", cap: 5, defaultDouble: 1 },
  { name: "Joker C3", cap: 6, defaultDouble: 2 },
  { name: "Joker C4", cap: 6, defaultDouble: 2 },
  { name: "Joker C8", cap: 6, defaultDouble: 2 },
  { name: "Joker 16", cap: 6, defaultDouble: 2 },
  { name: "Joker B3", cap: 3, defaultDouble: 0 },
  { name: "Joker B4", cap: 3, defaultDouble: 1 },
  { name: "Joker B6", cap: 3, defaultDouble: 1 },
  { name: "Arcelle 304", cap: 6, defaultDouble: 0 },
  { name: "Cusco E18", cap: 6, defaultDouble: 0 },
  { name: "Cusco E19", cap: 6, defaultDouble: 0 },
  { name: "Cusco E20", cap: 6, defaultDouble: 0 },
  { name: "Le Sérac K10", cap: 6, defaultDouble: 1 },
  { name: "Cusco K4", cap: 6, defaultDouble: 0 },
  { name: "Lauzières 612", cap: 6, defaultDouble: 1 },
];

// Cutlery drawer items — quantity scales with capacity (per-person * cap).
export const KITCHEN_ITEMS_MULTIPLIER = [
  "סכינים",
  "מזלגות",
  "כפות",
  "כפיות",
  "צלחות",
  "קערות",
  "כוסות",
];

// Quantity items with a fixed minimum (always need at least 2 per apartment).
export const KITCHEN_ITEMS_MIN2 = [
  "מחבתות",
  "סירים",
  "סכין חיתוך",
  "מרית",
  "כף הגשה",
];

// Status-only items (ok / partial / missing).
export const KITCHEN_ITEMS_STATUS = [
  "קולפן",
  "קנקן מים",
  "קרש חיתוך",
  "מיקרו תקין",
  "מדיח תקין",
  "מקרר תקין",
  "יש קומקום",
];

// Default per-person quantities for cutlery drawer items.
export const DEFAULT_PER_PERSON = {
  סכינים: 2,
  מזלגות: 2,
  כפות: 2,
  כפיות: 2,
  צלחות: 2,
  קערות: 2,
  כוסות: 2,
};

export const MIN2_REQUIRED = 2;

export const CATEGORIES = {
  "פינת אוכל": ["כסאות", "שולחן", "מפת שולחן"],
  "שירותים": ["תקינים", "דוש", "עובש", "נזילות", "ונטה", "לוזון"],
  "כללי חדר": [
    "מזרנים",
    "כיסוי מזרנים",
    "כריות",
    "ריחן",
    "שקעים",
    "שואב תקין",
    "חימום תקין",
    "מטאטא",
    "לחצן סבון",
    "נורות (2 רגילות, 1 שקועה)",
  ],
};

export const EXIT_CHECKLIST = [
  "ווידוא נקיון",
  "הוצאת כל האוכל מהדירה",
  "השארת מקרר פתוח",
  "ווידוא סגירת חלונות",
  "ווידוא אין נזילות (סגירת מים)",
  "הורדת חשמל",
];

export function isMultiplierItem(item) {
  return KITCHEN_ITEMS_MULTIPLIER.includes(item);
}

export function isMin2Item(item) {
  return KITCHEN_ITEMS_MIN2.includes(item);
}

export function isStatusItem(item) {
  return (
    KITCHEN_ITEMS_STATUS.includes(item) ||
    Object.values(CATEGORIES).flat().includes(item)
  );
}

export function isQuantityItem(item) {
  return isMultiplierItem(item) || isMin2Item(item);
}

export function getRequiredQuantity(item, capacity, perPersonConfig) {
  if (isMultiplierItem(item)) {
    const perPerson =
      perPersonConfig?.[item] ?? DEFAULT_PER_PERSON[item] ?? 1;
    return perPerson * capacity;
  }
  if (isMin2Item(item)) return MIN2_REQUIRED;
  return 1;
}

export function getAllCheckableItems() {
  return [
    ...KITCHEN_ITEMS_MULTIPLIER,
    ...KITCHEN_ITEMS_MIN2,
    ...KITCHEN_ITEMS_STATUS,
    ...Object.values(CATEGORIES).flat(),
  ];
}

export const STORAGE_KEY = "val_thorens_master_v5";
export const SHOPPING_KEY = "val_thorens_shopping_v1";
export const SHOPPING_CONFIG_KEY = "val_thorens_shopping_config_v1";
