"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";

export default function PhotoGrid({ photos, onAdd, onRemove }) {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => onAdd(reader.result);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-white shadow-soft group"
          >
            <img src={src} alt={`photo-${i}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1.5 left-1.5 bg-rose-500 text-white rounded-full p-1 shadow-md opacity-90 hover:opacity-100 transition-opacity"
              aria-label="הסר תמונה"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center bg-white text-amber-500 hover:bg-amber-50 transition-colors shadow-soft touch-feedback"
        >
          <Camera size={28} strokeWidth={2} />
          <span className="text-[10px] font-black mt-1 uppercase tracking-wide">צלם</span>
        </button>
      </div>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFiles}
      />
    </div>
  );
}
