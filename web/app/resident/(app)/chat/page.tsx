"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n";
import { useChat } from "@ai-sdk/react";
import { isTextUIPart, DefaultChatTransport, type UIMessage } from "ai";

function useVoiceInput(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [showUnsupported, setShowUnsupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setShowUnsupported(true);
      setTimeout(() => setShowUnsupported(false), 3500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, startListening, stopListening, showUnsupported };
}

export default function ChatPage() {
  const { t, bloomId } = useLanguage();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  const handleVoiceResult = useCallback((text: string) => {
    setInputValue((prev) => (prev ? prev + " " + text : text));
  }, []);

  const { isListening, startListening, stopListening, showUnsupported } = useVoiceInput(handleVoiceResult);

  const greeting = t("chat.greeting");
  const initialMessages: UIMessage[] = [
    { id: "greeting", role: "assistant", parts: [{ type: "text", text: greeting }] },
  ];
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { bloomId } }),
    messages: initialMessages,
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleClear() {
    setMessages(initialMessages);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    sendMessage({ text });
  }

  function getTextContent(msg: (typeof messages)[0]): string {
    return msg.parts.filter(isTextUIPart).map((p) => p.text).join("");
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)]">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-headline text-xl font-bold text-on-surface">{t("chat.title")}</h1>
          <p className="text-xs text-on-surface-variant">{t("chat.subtitle")}</p>
        </div>
        <button onClick={handleClear} className="text-xs text-on-surface-variant underline">
          {t("chat.clear")}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m) => {
          const text = getTextContent(m);
          if (!text) return null;
          return (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center shrink-0 mt-1 me-2">
                  <span
                    className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    spa
                  </span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-on-primary rounded-br-md"
                    : "bg-surface-container text-on-surface rounded-bl-md border border-outline-variant/20"
                }`}
              >
                {text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center shrink-0 mt-1 me-2">
              <span
                className="material-symbols-outlined text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                spa
              </span>
            </div>
            <div className="bg-surface-container text-on-surface-variant text-sm px-4 py-3 rounded-2xl rounded-bl-md border border-outline-variant/20 italic">
              {t("chat.thinking")}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-error text-xs py-2">{t("chat.error")}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Unsupported browser toast */}
      {showUnsupported && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-surface-container rounded-xl shadow-lg border border-outline-variant/20 flex items-center gap-2 max-w-xs">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">mic_off</span>
          <p className="text-xs text-on-surface-variant">Voice input requires Chrome, Edge, or Safari.</p>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="px-4 py-3 border-t border-outline-variant/20 flex gap-2 bg-background shrink-0"
      >
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
            isListening
              ? "bg-error text-white animate-pulse"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          } disabled:opacity-40`}
          title={isListening ? t("chat.stopRecording") : t("chat.voice")}
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isListening ? "stop" : "mic"}
          </span>
        </button>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? t("chat.recording") : t("chat.placeholder")}
          className="flex-1 px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform shrink-0"
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            send
          </span>
        </button>
      </form>
    </div>
  );
}
