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

export const KITCHEN_ITEMS_MULTIPLIER = [
  "סכינים",
  "מזלגות",
  "כפות",
  "כפיות",
  "צלחות",
  "קערות",
  "כוסות",
];

export const KITCHEN_ITEMS_FIXED = [
  "סכין חיתוך",
  "מחבתות",
  "סירים",
  "מרית",
  "כף הגשה",
  "קולפן",
  "קנקן מים",
  "מיקרו תקין",
  "מדיח תקין",
  "מקרר תקין",
  "יש קומקום",
  "קרש חיתוך",
];

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

export function getRequiredQuantity(item, capacity) {
  return isMultiplierItem(item) ? capacity * 2 : 1;
}

export function getAllCheckableItems() {
  return [
    ...KITCHEN_ITEMS_MULTIPLIER,
    ...KITCHEN_ITEMS_FIXED,
    ...Object.values(CATEGORIES).flat(),
  ];
}

export const STORAGE_KEY = "val_thorens_master_v4";
export const SHOPPING_KEY = "val_thorens_shopping_v1";
