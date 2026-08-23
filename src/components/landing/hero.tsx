"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiScanIcon, FileExportIcon, Shield01Icon } from "@hugeicons/core-free-icons";

const SAMPLE =
  "Artificial intelligence has fundamentally transformed the way people write, study and publish their ideas across every industry imaginable.";

const HIGHLIGHTS = new Set([
  "fundamentally",
  "transformed",
  "publish",
  "ideas",
  "industry",
  "imaginable",
]);

type Phase = "scan" | "flagged" | "clean";

const PHASE_MS: Record<Phase, number> = { scan: 2400, flagged: 1400, clean: 3200 };
const NEXT: Record<Phase, Phase> = { scan: "flagged", flagged: "clean", clean: "scan" };

function StatusChip({ phase }: { phase: Phase }) {
  if (phase === "scan") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        <span className="size-1.5 animate-pulse rounded-full bg-violet-500" aria-hidden="true" />
        Analyzing text…
      </span>
    );
  }
  if (phase === "flagged") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-600/20">
        <span className="size-1.5 rounded-full bg-rose-500" aria-hidden="true" />
        98% AI-generated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
      <HugeiconsIcon icon={Shield01Icon} className="size-3.5" />
      0% AI-detected
    </span>
  );
}

export function Hero() {
  const [phase, setPhase] = useState<Phase>("scan");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setPhase("clean"));
      return () => cancelAnimationFrame(id);
    }
    let timer: number;
    const schedule = (current: Phase) => {
      timer = window.setTimeout(() => {
        const next = NEXT[current];
        setPhase(next);
        schedule(next);
      }, PHASE_MS[current]);
    };
    schedule("scan");
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Free to start · Pro for documents
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl">
            Make plagiarism{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent animate-shimmer [background-size:200%_auto]">
              disappear.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-slate-500 lg:mx-0 sm:text-lg sm:leading-8">
            Remove plagiarism, outsmart AI detectors, and verify what’s really original — text,
            documents, and images. Six pro tools, one honest dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/plagiarism-remover"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
            >
              Remove plagiarism — free
              <HugeiconsIcon icon={AiScanIcon} className="ml-2 size-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:border-violet-200 hover:text-violet-700 sm:w-auto"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            No credit card · 700 free words without an account · Nothing is stored
          </p>
        </div>

        {/* Live demo card */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div
            aria-hidden="true"
            className={`absolute -inset-3 rounded-[2rem] blur-2xl transition-colors duration-700 ${
              phase === "flagged"
                ? "bg-rose-200/50"
                : phase === "clean"
                  ? "bg-emerald-200/50"
                  : "bg-violet-200/50"
            }`}
          />

          <div
            className={`relative overflow-hidden rounded-3xl border bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur transition-colors duration-500 sm:p-7 ${
              phase === "flagged" ? "border-rose-200/80" : phase === "clean" ? "border-emerald-200/80" : "border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
                  <HugeiconsIcon icon={AiScanIcon} className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">AI Text Detector</p>
                  <p className="text-[11px] text-slate-400">live preview</p>
                </div>
              </div>
              <StatusChip phase={phase} />
            </div>

            <div className="relative mt-5 rounded-2xl bg-slate-50/80 p-5">
              {phase === "scan" ? (
                <span
                  aria-hidden="true"
                  className="absolute left-2 right-2 h-0.5 animate-scan rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                />
              ) : null}
              <p className="relative text-[15px] leading-8 text-slate-700">
                {SAMPLE.split(" ").map((word, i) => {
                  const key = `${word}-${i}`;
                  const flagged = HIGHLIGHTS.has(word) && phase === "flagged";
                  const clean = HIGHLIGHTS.has(word) && phase === "clean";
                  return (
                    <span
                      key={key}
                      className={`rounded px-0.5 transition-colors duration-500 ${
                        flagged
                          ? "bg-rose-100 text-slate-900"
                          : clean
                            ? "bg-emerald-50 text-slate-800"
                            : ""
                      }`}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
              <span>1,000 words analyzed in 4.2s</span>
              <span className="font-medium text-slate-500">
                {phase === "clean" ? "Invisible markers embedded" : "…"}
              </span>
            </div>
          </div>

          {/* Floating chips */}
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-5 hidden animate-float items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-lg shadow-slate-900/8 sm:flex"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <HugeiconsIcon icon={Shield01Icon} className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800">3% similarity</p>
              <p className="text-[10px] text-slate-400">plagiarism checker</p>
            </div>
          </div>
          <div
            aria-hidden="true"
            style={{ animationDelay: "1.4s" }}
            className="absolute -bottom-6 -left-3 hidden animate-float-slow items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-lg shadow-slate-900/8 sm:flex"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <HugeiconsIcon icon={FileExportIcon} className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800">document.docx</p>
              <p className="text-[10px] text-slate-400">format preserved · Pro</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
