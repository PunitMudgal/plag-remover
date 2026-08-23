"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiBrain01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/tools/tool-shell";
import { TextInputCard, countWords } from "@/components/tools/text-input-card";
import { ScoreGauge } from "@/components/tools/score-gauge";
import { LoadingCard } from "@/components/tools/loading-card";
import { ErrorCard } from "@/components/tools/error-card";
import { SignInGateButton } from "@/components/tools/sign-in-gate";
import { VerdictBadge, type VerdictTone } from "@/components/tools/verdict-badge";

const MIN_WORDS = 20;

const LOADING_MESSAGES = [
  "Reading structure and rhythm",
  "Scoring sentence-by-sentence patterns",
  "Weighing human vs. AI signals",
  "Finalizing your report",
] as const;

type Verdict = "human" | "mixed" | "likely-ai" | "very-likely-ai";

const VERDICTS: Record<Verdict, { label: string; tone: VerdictTone }> = {
  human: { label: "Human-written", tone: "emerald" },
  mixed: { label: "Mixed signals", tone: "amber" },
  "likely-ai": { label: "Likely AI-generated", tone: "orange" },
  "very-likely-ai": { label: "Very likely AI-generated", tone: "rose" },
};

type DetectionResult = {
  aiPercentage: number;
  humanPercentage: number;
  verdict: Verdict;
  confidence: "low" | "medium" | "high";
  summary: string;
  sentences: { text: string; aiProbability: number }[];
  signals: { name: string; detail: string; strength: number }[];
};

function sentenceTone(probability: number) {
  if (probability >= 85) return "bg-rose-100 text-slate-900";
  if (probability >= 60) return "bg-orange-100/70 text-slate-900";
  if (probability >= 30) return "bg-amber-50 text-slate-900";
  return "bg-emerald-50 text-slate-700";
}

function strengthColor(strength: number) {
  if (strength >= 67) return "bg-rose-500";
  if (strength >= 34) return "bg-amber-500";
  return "bg-emerald-500";
}

export function AiTextDetectorClient() {
  const { isSignedIn } = useAuth();
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(text);
  const canRun = wordCount >= MIN_WORDS;

  const runDetection = async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/tools/ai-text-detector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The analysis failed. Please try again.");
      setResult(data as DetectionResult);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The analysis failed. Please try again.");
      setStatus("error");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignedIn || !canRun || status === "loading") return;
    void runDetection();
  };

  const verdict = result ? VERDICTS[result.verdict] : null;

  return (
    <ToolShell
      eyebrow="AI text detector"
      title={
        <>
          How <span className="text-sky-600">human</span> does it read?
        </>
      }
      description="Find out what share of any text was likely written by AI — with a sentence-by-sentence breakdown and the signals behind the verdict."
      contentClassName="max-w-4xl"
      footer="Heuristic analysis — no AI detector is 100% accurate · Your text is never stored"
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <TextInputCard
          id="detect-text"
          label="Text to analyze"
          value={text}
          onChange={setText}
          placeholder="Paste the text you want to check for AI writing..."
          minWords={MIN_WORDS}
          textareaClassName="min-h-56"
          footerNote="Sentence-level AI probability with signal breakdown"
        >
          {text ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => { setText(""); setResult(null); setStatus("idle"); }}>
              Clear
            </Button>
          ) : null}
          {isSignedIn ? (
            <Button
              type="submit"
              size="sm"
              disabled={!canRun || status === "loading"}
              className="rounded-xl bg-sky-600 px-4 text-white shadow-md shadow-sky-600/20 hover:bg-sky-700"
            >
              {status === "loading" ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  Detecting…
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={AiBrain01Icon} className="size-4" data-icon="inline-start" />
                  Detect AI text
                </>
              )}
            </Button>
          ) : (
            <SignInGateButton className="rounded-xl bg-sky-600 px-4 text-white shadow-md shadow-sky-600/20 hover:bg-sky-700">
              Sign in to detect
            </SignInGateButton>
          )}
        </TextInputCard>

        {status === "loading" ? (
          <LoadingCard active title="Analyzing your text" messages={LOADING_MESSAGES} />
        ) : null}

        {status === "error" && error ? <ErrorCard message={error} onRetry={() => void runDetection()} /> : null}

        {status === "idle" && !result ? (
          <div className="overflow-hidden rounded-3xl border border-sky-100 bg-slate-950 shadow-xl shadow-sky-950/10">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Detection report</p>
                <p className="mt-0.5 text-xs text-slate-400">Your result will appear here</p>
              </div>
              <HugeiconsIcon icon={AiBrain01Icon} className="size-5 text-slate-600" />
            </div>
            <div className="grid min-h-40 place-items-center px-5 py-4">
              <p className="text-sm text-slate-600">Add at least {MIN_WORDS} words and run the detector to see your report.</p>
            </div>
          </div>
        ) : null}

        {status === "done" && result && verdict ? (
          <div className="grid gap-4" aria-live="polite">
            <div className="grid items-center gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/6 sm:grid-cols-[auto_1fr]">
              <ScoreGauge value={result.aiPercentage} label="AI-generated" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <VerdictBadge tone={verdict.tone}>{verdict.label}</VerdictBadge>
                  <VerdictBadge tone="slate">Confidence: {result.confidence}</VerdictBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{result.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-rose-50 px-3 py-2">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-rose-400">AI-written</span>
                    <span className="block text-sm font-bold text-rose-700">{Math.round(result.aiPercentage)}%</span>
                  </span>
                  <span className="rounded-xl bg-emerald-50 px-3 py-2">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-emerald-500">Human-written</span>
                    <span className="block text-sm font-bold text-emerald-700">{Math.round(result.humanPercentage)}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">Sentence by sentence</p>
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  human
                  <span className="flex overflow-hidden rounded-full" aria-hidden="true">
                    <span className="size-3 bg-emerald-300" />
                    <span className="size-3 bg-amber-200" />
                    <span className="size-3 bg-orange-300" />
                    <span className="size-3 bg-rose-300" />
                  </span>
                  AI
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-[15px] leading-8 text-slate-700 wrap-break-word">
                  {result.sentences.map((sentence, i) => (
                    <span
                      key={i}
                      title={`${Math.round(sentence.aiProbability)}% likely AI`}
                      className={`mr-1 inline rounded px-0.5 ${sentenceTone(sentence.aiProbability)}`}
                    >
                      {sentence.text}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">Signals behind the verdict</p>
              </div>
              <ul className="divide-y divide-slate-100">
                {result.signals.map((signal) => (
                  <li key={signal.name} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-800">{signal.name}</p>
                      <div className="flex w-32 shrink-0 items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${strengthColor(signal.strength)}`}
                            style={{ width: `${Math.max(4, Math.min(100, signal.strength))}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold tabular-nums text-slate-500">{Math.round(signal.strength)}</span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">{signal.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-center text-xs text-slate-400">
              AI detection is probabilistic. Treat results as a strong signal, never as proof — short or heavily edited
              texts are especially hard to classify.
            </p>
          </div>
        ) : null}
      </form>
    </ToolShell>
  );
}
