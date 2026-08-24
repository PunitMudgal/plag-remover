"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type AccentKey = "violet" | "rose" | "sky" | "indigo" | "emerald";

const ACCENTS: Record<AccentKey, { line: string; glow: string; bracket: string }> = {
  violet: { line: "via-violet-400", glow: "via-violet-400/10", bracket: "border-violet-400/50" },
  rose: { line: "via-rose-400", glow: "via-rose-400/10", bracket: "border-rose-400/50" },
  sky: { line: "via-sky-400", glow: "via-sky-400/10", bracket: "border-sky-400/50" },
  indigo: { line: "via-indigo-400", glow: "via-indigo-400/10", bracket: "border-indigo-400/50" },
  emerald: { line: "via-emerald-400", glow: "via-emerald-400/10", bracket: "border-emerald-400/50" },
};

/**
 * GSAP-driven scanning visual: a glowing scan line sweeps up and down over
 * skeleton text (or a viewfinder-framed image block), synced with a gradient
 * shimmer on one shared timeline. Pauses when the tab is hidden and collapses
 * to a static state under prefers-reduced-motion.
 */
function ScanVisual({
  accent = "violet",
  variant = "text",
}: {
  accent?: AccentKey;
  variant?: "text" | "image";
}) {
  const scope = useRef<HTMLDivElement>(null);
  const palette = ACCENTS[accent];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        tl.to(".scan-rig", { top: "82%", duration: 1.5, ease: "sine.inOut", repeat: -1, yoyo: true }, 0).fromTo(
          ".scan-skel",
          { backgroundPosition: "200% 0" },
          { backgroundPosition: "-200% 0", duration: 1.5, ease: "none", repeat: -1 },
          0,
        );
        const onVisibility = () => (document.hidden ? tl.pause() : tl.resume());
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
          document.removeEventListener("visibilitychange", onVisibility);
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative h-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5"
      aria-hidden="true"
    >
      {variant === "text" ? (
        <div className="grid gap-3">
          <div className="scan-skel h-2.5 w-11/12 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
          <div className="scan-skel h-2.5 w-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
          <div className="scan-skel h-2.5 w-4/5 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
          <div className="scan-skel h-2.5 w-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
          <div className="scan-skel h-2.5 w-2/3 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
          <div className="scan-skel mt-2 h-2.5 w-full rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
          <div className="scan-skel h-2.5 w-5/6 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.16)_50%,rgba(255,255,255,0.05)_75%)] bg-[length:200%_100%]" />
        </div>
      ) : (
        <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-700/60 via-slate-800 to-slate-900">
          {/* viewfinder corners */}
          <span className={`absolute left-3 top-3 size-5 rounded-tl-md border-l-2 border-t-2 ${palette.bracket}`} />
          <span className={`absolute right-3 top-3 size-5 rounded-tr-md border-r-2 border-t-2 ${palette.bracket}`} />
          <span className={`absolute bottom-3 left-3 size-5 rounded-bl-md border-b-2 border-l-2 ${palette.bracket}`} />
          <span className={`absolute bottom-3 right-3 size-5 rounded-br-md border-b-2 border-r-2 ${palette.bracket}`} />
          {/* faux image content */}
          <div className="scan-skel absolute left-1/2 top-1/2 h-20 w-28 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[linear-gradient(110deg,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0.04)_75%)] bg-[length:200%_100%]" />
        </div>
      )}

      {/* the scan rig: glow band + bright line, swept by GSAP */}
      <div className="scan-rig absolute inset-x-5 top-[6%]">
        <div className={`h-16 bg-gradient-to-b from-transparent to-transparent ${palette.glow} blur-md`} />
        <div className={`h-[3px] rounded-full bg-gradient-to-r from-transparent to-transparent ${palette.line} shadow-[0_0_16px_rgba(148,163,255,0.45)]`} />
      </div>
    </div>
  );
}

/**
 * Dark result-card placeholder shown while a tool is running: GSAP scan
 * animation plus rotating status lines so the wait feels active.
 */
export function LoadingCard({
  active,
  messages,
  title = "Analyzing",
  accent = "violet",
  variant = "text",
  intervalMs = 1800,
}: {
  active: boolean;
  messages: readonly string[];
  title?: string;
  accent?: AccentKey;
  variant?: "text" | "image";
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [active, messages.length, intervalMs]);

  return (
    <div aria-live="polite" aria-busy="true" className="overflow-hidden rounded-3xl border border-violet-100 bg-slate-950 shadow-xl shadow-violet-950/10">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="size-4 animate-spin rounded-full border-2 border-violet-400/40 border-t-violet-400" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">This usually takes 5–20 seconds</p>
        </div>
      </div>
      <div className="grid gap-4 px-5 py-5">
        <ScanVisual accent={accent} variant={variant} />
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
