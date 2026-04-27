"use client";

import { useState } from "react";
import { Share2, MessageCircle, FileText, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { shareNative, shareWhatsApp } from "@/lib/whatsapp";

export default function ShareMenu({ title, text, onPDF, label = "שתף" }) {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("הועתק ללוח");
    } catch {
      toast.error("העתקה נכשלה");
    }
    setOpen(false);
  };

  const handleWhatsApp = () => {
    shareWhatsApp(text);
    setOpen(false);
  };

  const handleNative = async () => {
    await shareNative(title, text);
    setOpen(false);
  };

  const handlePDF = () => {
    onPDF?.();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-200 hover:bg-brand-600 transition-colors touch-feedback"
      >
        <Share2 size={16} />
        {label}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-soft-lg border border-slate-100 z-40 overflow-hidden animate-scale-in origin-top-left">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-right transition-colors"
            >
              <MessageCircle size={18} className="text-emerald-600" />
              <span className="text-sm font-bold text-slate-700">WhatsApp</span>
            </button>
            {onPDF && (
              <button
                type="button"
                onClick={handlePDF}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 text-right transition-colors border-t border-slate-100"
              >
                <FileText size={18} className="text-rose-600" />
                <span className="text-sm font-bold text-slate-700">הורד PDF</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-right transition-colors border-t border-slate-100"
            >
              <Copy size={18} className="text-slate-600" />
              <span className="text-sm font-bold text-slate-700">העתק טקסט</span>
            </button>
            {typeof navigator !== "undefined" && navigator.share && (
              <button
                type="button"
                onClick={handleNative}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-50 text-right transition-colors border-t border-slate-100"
              >
                <Share2 size={18} className="text-brand-600" />
                <span className="text-sm font-bold text-slate-700">שתף (אחר)</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
