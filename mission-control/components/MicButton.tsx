"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// Click-to-talk dictation using the browser's built-in SpeechRecognition.
// No API keys, no network — runs entirely in the browser. Emits recognized
// phrases via onResult so the parent can append them to its input.

// minimal typing for the (non-standard) Web Speech API
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
};

export default function MicButton({
  onResult,
  accent = "#8b5cf6",
}: {
  onResult: (text: string) => void;
  accent?: string;
}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const cbRef = useRef(onResult);
  cbRef.current = onResult;

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true; // keep listening until the user clicks stop
    rec.interimResults = false;
    rec.onresult = (e) => {
      let phrase = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) phrase += e.results[i][0].transcript;
      }
      phrase = phrase.trim();
      if (phrase) cbRef.current(phrase);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, []);

  function toggle() {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch {
        /* already started */
      }
    }
  }

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input isn't supported in this browser. Try Chrome or Safari."
        className="grid place-items-center rounded-xl opacity-35"
        style={{ width: 38, height: 38, background: "var(--panel-2)" }}
        aria-label="Voice input unsupported"
      >
        🎤
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggle}
      title={listening ? "Listening… click to stop" : "Click to talk"}
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      aria-pressed={listening}
      className="relative grid place-items-center rounded-xl"
      style={{
        width: 38,
        height: 38,
        background: listening ? "#ef4444" : "var(--panel-2)",
        border: "1px solid var(--border)",
        color: listening ? "#fff" : "var(--muted)",
      }}
    >
      {listening && (
        <motion.span
          className="absolute inset-0 rounded-xl"
          style={{ border: "2px solid #ef4444" }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span style={{ filter: listening ? "none" : `drop-shadow(0 0 4px ${accent}55)` }}>🎤</span>
    </motion.button>
  );
}
