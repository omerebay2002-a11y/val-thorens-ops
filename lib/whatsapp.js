import { isMultiplierItem, getRequiredQuantity } from "./data";

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

export function formatApartmentReport(apt, data) {
  const lines = [];
  lines.push(`*${apt.name}* — דוח בדיקה`);
  lines.push(
    `👥 קיבולת: ${apt.cap} | 🛏️ זוגיות: ${data.doubleBeds || 0} | 🔑 מפתחות: ${
      data.keys || 0
    }`
  );
  lines.push("");

  const missing = Object.entries(data.checks || {})
    .filter(([, c]) => c.status === "missing" || c.status === "partial")
    .map(([item, c]) => {
      const required = getRequiredQuantity(item, apt.cap);
      const reqText = isMultiplierItem(item) ? ` (${required})` : "";
      const statusIcon = c.status === "missing" ? "❌" : "⚠️";
      const noteText = c.note ? ` — ${c.note}` : "";
      return `${statusIcon} ${item}${reqText}${noteText}`;
    });

  if (missing.length > 0) {
    lines.push("*חוסרים / בעיות:*");
    lines.push(...missing);
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
        lines.push(`  • ${m.item}${m.note ? ` (${m.note})` : ""}`);
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
  lines.push(`סה"כ ${items.length} סוגי פריטים חסרים`);
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
