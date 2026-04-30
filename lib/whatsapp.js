import {
  isMultiplierItem,
  isMin2Item,
  isQuantityItem,
  getRequiredQuantity,
  KITCHEN_ITEMS_MULTIPLIER,
  KITCHEN_ITEMS_MIN2,
} from "./data";

function formatDate(timestamp) {
  if (!timestamp) return "טרם נבדק";
  const d = new Date(timestamp);
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatApartmentReport(apt, data, config) {
  const lines = [];
  lines.push(`*${apt.name}* — דוח בדיקה`);
  lines.push(
    `👥 קיבולת: ${apt.cap} | 🛏️ זוגיות: ${data.doubleBeds || 0} | 🔑 מפתחות: ${
      data.keys || 0
    }`
  );
  lines.push("");

  // Quantity shortages
  const quantityLines = [];
  [...KITCHEN_ITEMS_MULTIPLIER, ...KITCHEN_ITEMS_MIN2].forEach((item) => {
    const have = Number.isFinite(data.counts?.[item]) ? data.counts[item] : 0;
    const required = getRequiredQuantity(item, apt.cap, config);
    const shortage = Math.max(0, required - have);
    if (shortage > 0) {
      const icon = have === 0 ? "❌" : "⚠️";
      const note = data.checks?.[item]?.note ? ` — ${data.checks[item].note}` : "";
      quantityLines.push(`${icon} ${item} (${have}/${required})${note}`);
    }
  });

  // Status shortages
  const statusLines = Object.entries(data.checks || {})
    .filter(
      ([item, c]) =>
        !isQuantityItem(item) &&
        (c.status === "missing" || c.status === "partial")
    )
    .map(([item, c]) => {
      const statusIcon = c.status === "missing" ? "❌" : "⚠️";
      const noteText = c.note ? ` — ${c.note}` : "";
      return `${statusIcon} ${item}${noteText}`;
    });

  const allMissing = [...quantityLines, ...statusLines];
  if (allMissing.length > 0) {
    lines.push("*חוסרים / בעיות:*");
    lines.push(...allMissing);
    lines.push("");
  }

  if (data.renovationText?.trim()) {
    lines.push("*שיפוצים נדרשים:*");
    lines.push(data.renovationText);
    lines.push("");
  }

  if (data.photos?.length > 0) {
    lines.push(`📸 ${data.photos.length} תמונות (יש לשלוח בנפרד)`);
  }

  lines.push(`🕐 נבדק: ${formatDate(data.lastChecked)}`);
  lines.push(data.completed ? "✅ הדירה סגורה" : "🔓 הדירה פתוחה");

  return lines.join("\n");
}

export function formatGlobalIssuesReport(issues) {
  const lines = [];
  lines.push(`*דוח תקלות גלובלי — Val Thorens*`);
  lines.push(`סה"כ ${issues.length} דירות עם בעיות`);
  lines.push("");

  issues.forEach((issue) => {
    const priorityEmoji =
      issue.priority === "high" ? "🔴" : issue.priority === "low" ? "🟢" : "🟡";
    lines.push(`${priorityEmoji} *${issue.apartment.name}*`);

    if (issue.missingItems.length > 0) {
      issue.missingItems.slice(0, 5).forEach((m) => {
        const qty =
          m.have !== undefined && m.required !== undefined
            ? ` (${m.have}/${m.required})`
            : "";
        const noteText = m.note ? ` (${m.note})` : "";
        lines.push(`  • ${m.item}${qty}${noteText}`);
      });
      if (issue.missingItems.length > 5) {
        lines.push(`  • ועוד ${issue.missingItems.length - 5}...`);
      }
    }
    if (issue.renovationText) {
      lines.push(`  🔧 ${issue.renovationText.slice(0, 100)}`);
    }
    if (issue.photos.length > 0) {
      lines.push(`  📸 ${issue.photos.length} תמונות`);
    }
    lines.push("");
  });

  return lines.join("\n");
}

export function formatShoppingList(items) {
  const lines = [];
  lines.push(`*רשימת קניות — Val Thorens*`);
  const totalUnits = items.reduce((s, i) => s + i.totalShortage, 0);
  lines.push(`סה"כ ${items.length} סוגי פריטים, ${totalUnits} יחידות חסרות`);
  lines.push("");

  items.forEach((item) => {
    lines.push(
      `• *${item.item}* — חסר ${item.totalShortage} (${item.apartments.length} דירות)`
    );
  });

  return lines.join("\n");
}

export function shareWhatsApp(text) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

export async function shareNative(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch (e) {
      if (e.name === "AbortError") return false;
    }
  }
  shareWhatsApp(text);
  return true;
}
