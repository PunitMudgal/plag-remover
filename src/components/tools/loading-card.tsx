"use client";

import { useEffect, useState } from "react";

/**
 * Dark result-card placeholder shown while a tool is running: spinner plus
 * rotating status lines so the wait feels active instead of frozen.
 */
export function LoadingCard({
  active,
  messages,
  title = "Analyzing",
}: {
  /** Index of the message to start rotating from when mounted. */
  active: boolean;
  messages: readonly string[];
  title?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, 1800);
    return () => window.clearInterval(interval);
  }, [active, messages.length]);

  return (
    <div aria-live="polite" aria-busy="true" className="overflow-hidden rounded-3xl border border-violet-100 bg-slate-950 shadow-xl shadow-violet-950/10">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="size-4 animate-spin rounded-full border-2 border-violet-400/40 border-t-violet-400" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">This usually takes 5–20 seconds</p>
        </div>
      </div>
      <div className="min-h-40 px-5 py-4">
        <ul className="grid gap-2.5">
          {messages.map((message, i) => (
            <li
              key={message}
              className={`flex items-center gap-2.5 text-sm transition-opacity duration-500 ${
                i < index ? "text-slate-500" : i === index ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {i < index ? (
                <span className="grid size-4 place-items-center rounded-full bg-emerald-500/15 text-emerald-400" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3">
                    <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span
                  className={`size-1.5 rounded-full ${i === index ? "bg-violet-400" : "bg-slate-700"}`}
                  aria-hidden="true"
                />
              )}
              {message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
