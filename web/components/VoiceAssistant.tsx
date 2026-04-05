"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any;

// Map voice intents to routes
const INTENT_ROUTES: { pattern: RegExp; route: string; label: string }[] = [
  { pattern: /yoga|योग|ਯੋਗਾ|يوغا/i,            route: "/resident/body?cat=yoga",       label: "Yoga" },
  { pattern: /stretch|stretching/i,               route: "/resident/body?cat=stretching",  label: "Stretching" },
  { pattern: /breath|breathing|breathe/i,         route: "/resident/body?cat=breathing",   label: "Breathing" },
  { pattern: /danc|movement|move/i,               route: "/resident/body?cat=dance",       label: "Dance" },
  { pattern: /strength|exercise|workout/i,        route: "/resident/body?cat=strength",    label: "Strength" },
  { pattern: /body|exercise|movement|workout/i,   route: "/resident/body",                 label: "Body" },
  { pattern: /ground|anchor|calm|anxious|panic/i, route: "/resident/grounding",            label: "Grounding" },
  { pattern: /chat|talk|feeling|help|sad|depress|lonely|scared|angry/i, route: "/resident/chat", label: "Chat" },
  { pattern: /soul|express|draw|art|creat/i,      route: "/resident/soul",                 label: "Soul Expression" },
  { pattern: /connect|community|whisper/i,        route: "/resident/connect",              label: "Connect" },
  { pattern: /resource|help|housing|food|service|211/i, route: "/resident/resources",    label: "Resources" },
  { pattern: /garden|bloom|history/i,             route: "/resident/garden",              label: "Garden" },
  { pattern: /home|sanctuary|main/i,              route: "/resident/home",                label: "Home" },
];

type State = "idle" | "listening" | "processing" | "result" | "error" | "unsupported";

export default function VoiceAssistant() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [transcript, setTranscript] = useState("");
  const [matchLabel, setMatchLabel] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [supported, setSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<AnySpeechRecognition>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      recognitionRef.current?.abort();
    };
  }, []);

  function resetAfterDelay(ms = 2500) {
    timeoutRef.current = setTimeout(() => {
      setState("idle");
      setTranscript("");
      setMatchLabel("");
    }, ms);
  }

  function startListening() {
    if (state !== "idle") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState("unsupported");
      resetAfterDelay(3500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    setState("listening");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      setState("processing");
      const text = Array.from(event.results[0])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((alt: any) => alt.transcript as string)
        .join(" ");
      setTranscript(text);

      // Find matching intent
      const match = INTENT_ROUTES.find((r) => r.pattern.test(text));
      if (match) {
        setMatchLabel(match.label);
        setState("result");
        timeoutRef.current = setTimeout(() => {
          router.push(match.route);
          setState("idle");
          setTranscript("");
          setMatchLabel("");
        }, 1200);
      } else {
        // Fallback to chat with the transcript
        setMatchLabel("Chat");
        setState("result");
        timeoutRef.current = setTimeout(() => {
          router.push(`/resident/chat`);
          setState("idle");
          setTranscript("");
          setMatchLabel("");
        }, 1200);
      }
    };

    recognition.onerror = () => {
      setState("error");
      resetAfterDelay();
    };

    recognition.onend = () => {
      setState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognition.start();
  }

  function cancelListening() {
    recognitionRef.current?.abort();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState("idle");
    setTranscript("");
    setMatchLabel("");
  }

  const BG_COLORS: Record<State, string> = {
    idle: "bg-primary shadow-lg",
    listening: "bg-error shadow-lg shadow-error/30 animate-pulse",
    processing: "bg-secondary shadow-lg",
    result: "bg-primary-container shadow-lg",
    error: "bg-outline shadow-lg",
    unsupported: "bg-outline shadow-lg",
  };

  return (
    <>
      {/* Toast overlay */}
      {state !== "idle" && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-surface-container rounded-2xl shadow-xl border border-outline-variant/20 flex items-center gap-3 max-w-xs w-[90vw]">
          {state === "listening" && (
            <>
              <span className="w-3 h-3 bg-error rounded-full animate-ping shrink-0" />
              <p className="text-sm text-on-surface font-medium">Listening… speak now</p>
              <button onClick={cancelListening} className="ms-auto text-on-surface-variant">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </>
          )}
          {state === "processing" && (
            <>
              <span className="material-symbols-outlined text-secondary text-xl animate-spin">progress_activity</span>
              <p className="text-sm text-on-surface font-medium">Understanding…</p>
            </>
          )}
          {state === "result" && (
            <>
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-on-surface-variant truncate">&ldquo;{transcript}&rdquo;</p>
                <p className="text-sm font-semibold text-primary">Opening {matchLabel}</p>
              </div>
            </>
          )}
          {state === "error" && (
            <>
              <span className="material-symbols-outlined text-outline text-xl">mic_off</span>
              <p className="text-sm text-on-surface-variant">Couldn&apos;t hear you. Try again.</p>
            </>
          )}
          {state === "unsupported" && (
            <>
              <span className="material-symbols-outlined text-outline text-xl">mic_off</span>
              <p className="text-sm text-on-surface-variant">Voice input requires Chrome, Edge, or Safari.</p>
            </>
          )}
        </div>
      )}

      {/* Floating mic button */}
      <div className="fixed bottom-20 end-5 z-50 flex flex-col items-end gap-2">
        {showTooltip && state === "idle" && (
          <div className="bg-surface-container text-on-surface text-xs font-medium px-3 py-1.5 rounded-xl shadow border border-outline-variant/20 whitespace-nowrap">
            Tap to speak
          </div>
        )}
        <button
          onClick={state === "idle" || state === "unsupported" ? startListening : cancelListening}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Voice assistant"
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${BG_COLORS[state === "unsupported" ? "idle" : state]}`}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              state === "result" ? "text-primary" : "text-white"
            }`}
            style={{ fontVariationSettings: state === "listening" ? "'FILL' 1" : "'FILL' 0" }}
          >
            {state === "listening" ? "mic" : state === "result" ? "check" : "mic"}
          </span>
        </button>
      </div>
    </>
  );
}
