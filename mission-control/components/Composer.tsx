"use client";

import { motion } from "motion/react";
import MicButton from "./MicButton";

// Shared chat composer: textarea + mic (browser speech-to-text) + send button.
export default function Composer({
  value,
  onChange,
  onSend,
  accent = "#8b5cf6",
  placeholder = "Message…",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  accent?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="px-6 pb-6">
      <div className="mx-auto max-w-3xl">
        <div className="surface focus-ring flex items-end gap-2 p-2 pl-4" style={{ borderRadius: 18 }}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent py-2 text-sm outline-none"
            style={{ color: "var(--text)", maxHeight: 160 }}
          />
          <MicButton accent={accent} onResult={(t) => onChange(value && !value.endsWith(" ") ? `${value} ${t}` : `${value}${t}`)} />
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="grid place-items-center rounded-xl text-white disabled:opacity-40"
            style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${accent}, #6d28d9)` }}
            aria-label="Send"
          >
            ↑
          </motion.button>
        </div>
        <div className="mt-2 text-center text-[11px]" style={{ color: "var(--muted)" }}>
          Enter to send · Shift+Enter for newline · 🎤 click to talk
        </div>
      </div>
    </div>
  );
}
