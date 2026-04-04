"use client";

import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

const AFFIRMATIONS = [
  "You are more resilient than you know.",
  "Your feelings are valid. Your journey is real.",
  "You deserve rest, safety, and joy.",
  "You are worthy of the care you give others.",
  "Every breath is a small act of courage.",
  "You are not alone. You never were.",
  "Healing is not linear — and that is okay.",
];

export default function SoulPage() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#52695e");
  const [brushSize, setBrushSize] = useState(4);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const todayAffirmation = AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length];

  useEffect(() => {
    if (!timerActive) return;
    if (timerSeconds === 0) {
      setTimerActive(false);
      setTimerDone(true);
      return;
    }
    const id = setTimeout(() => setTimerSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timerSeconds]);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (!canvasRef.current) return;
    e.preventDefault();
    setDrawing(true);
    if (!timerActive && !timerDone) setTimerActive(true);
    lastPos.current = getPos(e, canvasRef.current);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing || !canvasRef.current || !lastPos.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }

  function stopDraw() {
    setDrawing(false);
    lastPos.current = null;
  }

  function clearCanvas() {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setTimerSeconds(30);
    setTimerActive(false);
    setTimerDone(false);
  }

  const PALETTE = ["#52695e", "#6d6258", "#6b6077", "#af3d3b", "#383833", "#bbb9b2"];

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <section className="text-center mb-6">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">{t("soul.title")}</h1>
        <p className="text-on-surface-variant text-sm">{t("soul.subtitle")}</p>
      </section>

      {/* Daily Affirmation */}
      <div className="bg-primary-container/20 border border-primary/15 rounded-2xl p-6 mb-6 text-center">
        <span className="text-[10px] font-bold tracking-widest text-primary uppercase mb-3 block">{t("soul.affirmationLabel")}</span>
        <span
          className="material-symbols-outlined text-primary text-3xl mb-3 block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <p className="font-headline text-lg font-semibold text-on-surface leading-relaxed italic">
          &ldquo;{todayAffirmation}&rdquo;
        </p>
      </div>

      {/* Doodle Canvas */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-headline text-base font-semibold text-on-surface">{t("soul.doodleTitle")}</h2>
            <p className="text-xs text-on-surface-variant">{t("soul.doodleSubtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
              timerDone ? "bg-primary-container text-primary" : "bg-surface-container-high text-on-surface-variant"
            }`}>
              <span className="material-symbols-outlined text-sm">timer</span>
              {timerDone ? t("soul.done") : `${timerSeconds}s`}
            </div>
            {/* Clear */}
            <button onClick={clearCanvas} className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-base">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Palette */}
        <div className="flex gap-2 mb-3">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? "scale-125 border-on-surface" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="flex items-center gap-1 ms-auto">
            {[2, 4, 8, 14].map((s) => (
              <button
                key={s}
                onClick={() => setBrushSize(s)}
                className={`rounded-full border transition-transform ${brushSize === s ? "scale-110 border-primary" : "border-transparent"} flex items-center justify-center`}
                style={{ width: s + 14, height: s + 14 }}
              >
                <div className="rounded-full bg-on-surface-variant" style={{ width: s, height: s }} />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={380}
          height={240}
          className="w-full rounded-xl bg-surface-container-lowest touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  );
}
