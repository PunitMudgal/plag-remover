"use client";

import { useEffect, useState } from "react";

function toneFor(value: number) {
  if (value < 34) {
    return { stroke: "stroke-emerald-500", text: "text-emerald-600" };
  }
  if (value < 67) {
    return { stroke: "stroke-amber-500", text: "text-amber-600" };
  }
  return { stroke: "stroke-rose-500", text: "text-rose-600" };
}

/**
 * Animated circular score gauge. The number counts up and the ring fills
 * over ~1s. Color reflects severity: emerald (low) → amber → rose (high).
 */
export function ScoreGauge({
  value,
  label,
  size = 176,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(clamped * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - display / 100);
  const tone = toneFor(clamped);

  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-label={`${label}: ${clamped} percent`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-slate-100" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${tone.stroke} transition-[stroke] duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold tabular-nums tracking-tight ${tone.text}`}>{display}%</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
    </div>
  );
}
