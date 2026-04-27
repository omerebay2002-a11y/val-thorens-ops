"use client";

import { Mic, MicOff } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import toast from "react-hot-toast";

export default function VoiceRecorder({ onTranscript, currentText = "" }) {
  const { isSupported, isRecording, interim, toggle } = useVoiceRecorder({
    onResult: (final) => {
      const sep = currentText && !currentText.endsWith(" ") ? " " : "";
      onTranscript((currentText + sep + final).trim());
    },
  });

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (!isRecording) {
      toast("מקליט... דבר עכשיו", { icon: "🎤", duration: 1200 });
    }
    toggle();
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        className={`p-2.5 rounded-xl transition-all touch-feedback ${
          isRecording
            ? "bg-rose-500 text-white animate-pulse-soft shadow-lg shadow-rose-300"
            : "bg-brand-50 text-brand-600 hover:bg-brand-100"
        }`}
        title={isRecording ? "עצור הקלטה" : "הקלט הערה"}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      {isRecording && interim && (
        <div className="text-[10px] text-slate-500 italic max-w-[120px] truncate" title={interim}>
          {interim}
        </div>
      )}
    </div>
  );
}
