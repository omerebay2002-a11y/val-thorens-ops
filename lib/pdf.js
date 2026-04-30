import { jsPDF } from "jspdf";
import {
  formatApartmentReport,
  formatGlobalIssuesReport,
  formatShoppingList,
} from "./whatsapp";

function reverseHebrewLine(line) {
  // jsPDF does not natively support RTL/Hebrew shaping. We reverse the visual
  // order so that the PDF reader displays the text correctly. This is a
  // pragmatic compromise: it works well for plain Hebrew text without complex
  // mixed-direction content.
  return line.split("").reverse().join("");
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = text.split("\n");
  let cursorY = y;

  lines.forEach((line) => {
    if (!line.trim()) {
      cursorY += lineHeight / 2;
      return;
    }
    const wrapped = doc.splitTextToSize(line, maxWidth);
    wrapped.forEach((wl) => {
      const reversed = reverseHebrewLine(wl);
      doc.text(reversed, x, cursorY, { align: "right" });
      cursorY += lineHeight;
    });
  });

  return cursorY;
}

function newDoc() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica");
  return doc;
}

export function downloadApartmentPDF(apt, data) {
  const doc = newDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const usableWidth = pageWidth - margin * 2;

  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text(reverseHebrewLine(`Val Thorens — ${apt.name}`), pageWidth - margin, margin + 8, {
    align: "right",
  });

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const text = formatApartmentReport(apt, data).replace(/\*/g, "");
  let y = margin + 20;
  y = addWrappedText(doc, text, pageWidth - margin, y, usableWidth, 6);

  // Photos
  if (data.photos?.length) {
    if (y > 220) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(13);
    doc.setTextColor(99, 102, 241);
    doc.text(reverseHebrewLine("תמונות שיפוץ"), pageWidth - margin, y, {
      align: "right",
    });
    y += 8;

    const imgSize = 50;
    const gap = 4;
    let x = margin;
    data.photos.forEach((p) => {
      if (y + imgSize > 280) {
        doc.addPage();
        y = margin;
        x = margin;
      }
      try {
        doc.addImage(p, "JPEG", x, y, imgSize, imgSize);
      } catch {
        // ignore broken images
      }
      x += imgSize + gap;
      if (x + imgSize > pageWidth - margin) {
        x = margin;
        y += imgSize + gap;
      }
    });
  }

  doc.save(`${apt.name.replace(/\s+/g, "_")}.pdf`);
}

export function downloadIssuesPDF(issues) {
  const doc = newDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text(reverseHebrewLine("דוח תקלות גלובלי"), pageWidth - margin, margin + 8, {
    align: "right",
  });

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const text = formatGlobalIssuesReport(issues).replace(/\*/g, "");
  addWrappedText(doc, text, pageWidth - margin, margin + 20, pageWidth - margin * 2, 6);

  doc.save(`val_thorens_issues_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function downloadShoppingListPDF(items) {
  const doc = newDoc();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text(reverseHebrewLine("רשימת קניות"), pageWidth - margin, margin + 8, {
    align: "right",
  });

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const text = formatShoppingList(items).replace(/\*/g, "");
  addWrappedText(doc, text, pageWidth - margin, margin + 20, pageWidth - margin * 2, 6);

  doc.save(`val_thorens_shopping_${new Date().toISOString().slice(0, 10)}.pdf`);
}
