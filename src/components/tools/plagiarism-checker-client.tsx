"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiScanIcon, ArrowUpRightIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/tools/tool-shell";
import { TextInputCard, countWords } from "@/components/tools/text-input-card";
import { ScoreGauge } from "@/components/tools/score-gauge";
import { LoadingCard } from "@/components/tools/loading-card";
import { ErrorCard } from "@/components/tools/error-card";
import { SignInGateButton } from "@/components/tools/sign-in-gate";
import { ModeTabs } from "@/components/tools/mode-tabs";
import { DocumentUpload } from "@/components/tools/document-upload";
import { UpgradeGate } from "@/components/tools/upgrade-gate";
import { VerdictBadge, type VerdictTone } from "@/components/tools/verdict-badge";
import { hasPaidPlan } from "@/config/billing";

const MIN_WORDS = 20;

const LOADING_MESSAGES = [
  "Extracting distinctive phrases",
  "Searching the web for matches",
  "Verifying sources against your text",
  "Calculating your similarity score",
] as const;

const DOC_LOADING_MESSAGES = ["Extracting text from your document", ...LOADING_MESSAGES] as const;

const VERDICTS: Record<Verdict, { label: string; tone: VerdictTone }> = {
  original: { label: "Original", tone: "emerald" },
  "minor-matches": { label: "Minor matches", tone: "amber" },
  "significant-matches": { label: "Significant matches", tone: "orange" },
  plagiarized: { label: "Plagiarized", tone: "rose" },
};

type Verdict = "original" | "minor-matches" | "significant-matches" | "plagiarized";

type SourceMatch = {
  url: string;
  title: string;
  domain: string;
  similarity: number;
  matchedSegments: string[];
};

type ScanResult = {
  similarityScore: number;
  originalityScore: number;
  verdict: Verdict;
  summary: string;
  matches: SourceMatch[];
  /** Present when the scan came from an uploaded document. */
  extractedText?: string;
};

/** Locate all matched segments in the text and merge them into ranges. */
function findMatchRanges(text: string, segments: string[]): Array<[number, number]> {
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];
  for (const segment of segments) {
    const needle = segment.trim().toLowerCase();
    if (needle.length < 8) continue;
    let from = 0;
    for (;;) {
      const idx = lower.indexOf(needle, from);
      if (idx === -1) break;
      ranges.push([idx, idx + needle.length]);
      from = idx + needle.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }
  return merged;
}

function HighlightedText({ text, matches }: { text: string; matches: SourceMatch[] }) {
  const parts = useMemo(() => {
    const segments = matches.flatMap((m) => m.matchedSegments);
    const ranges = findMatchRanges(text, segments);
    const nodes: Array<{ text: string; matched: boolean }> = [];
    let cursor = 0;
    for (const [start, end] of ranges) {
      if (start > cursor) nodes.push({ text: text.slice(cursor, start), matched: false });
      nodes.push({ text: text.slice(start, end), matched: true });
      cursor = end;
    }
    if (cursor < text.length) nodes.push({ text: text.slice(cursor), matched: false });
    return nodes;
  }, [text, matches]);

  return (
    <p className="whitespace-pre-wrap text-[15px] leading-8 text-slate-700 wrap-break-word">
      {parts.map((part, i) =>
        part.matched ? (
          <mark key={i} className="rounded-sm bg-rose-100 px-0.5 text-slate-900 decoration-rose-400 underline-offset-4">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

export function PlagiarismCheckerClient() {
  const { isSignedIn, isLoaded, has } = useAuth();
  const [mode, setMode] = useState<"text" | "document">("text");

  const [text, setText] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canUploadDocs = isLoaded && isSignedIn && hasPaidPlan(has);

  const wordCount = countWords(text);
  const canScan = wordCount >= MIN_WORDS;

  const runScan = async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/tools/plagiarism-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The scan failed. Please try again.");
      setResult(data as ScanResult);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The scan failed. Please try again.");
      setStatus("error");
    }
  };

  const runDocumentScan = async () => {
    if (!docFile) return;
    setStatus("loading");
    setError(null);
    try {
      const body = new FormData();
      body.append("document", docFile);
      const res = await fetch("/api/tools/plagiarism-checker/document", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The scan failed. Please try again.");
      setResult(data as ScanResult);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The scan failed. Please try again.");
      setStatus("error");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignedIn || !canScan || status === "loading") return;
    void runScan();
  };

  const switchMode = (next: string) => {
    setMode(next as "text" | "document");
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  const verdict = result ? VERDICTS[result.verdict] : null;
  const scannedText = result?.extractedText ?? text.trim();

  return (
    <ToolShell
      eyebrow="Plagiarism checker"
      title={
        <>
          Scan every <span className="text-rose-600">sentence.</span>
        </>
      }
      description="Check pasted text or whole documents against live web sources, highlighting exactly what matches and where it came from."
      contentClassName="max-w-4xl"
      footer="Matches are verified against live search results · Documents are a Pro feature"
    >
      <div className="mb-6 flex justify-center">
        <ModeTabs
          value={mode}
          onChange={switchMode}
          tabs={[
            { value: "text", label: "Paste text" },
            { value: "document", label: "Upload document", badge: "Pro" },
          ]}
        />
      </div>

      {mode === "text" ? (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <TextInputCard
            id="scan-text"
            label="Text to scan"
            value={text}
            onChange={setText}
            placeholder="Paste the text you want to check for plagiarism..."
            minWords={MIN_WORDS}
            textareaClassName="min-h-56"
            footerNote="Scanned against live web sources via Google Search"
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
                disabled={!canScan || status === "loading"}
                className="rounded-xl bg-rose-600 px-4 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700"
              >
                {status === "loading" ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                    Scanning…
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={AiScanIcon} className="size-4" data-icon="inline-start" />
                    Scan text
                  </>
                )}
              </Button>
            ) : (
              <SignInGateButton className="rounded-xl bg-rose-600 px-4 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700">
                Sign in to scan
              </SignInGateButton>
            )}
          </TextInputCard>

          {!isSignedIn && canScan ? (
            <p className="text-center text-xs text-slate-400">
              Plagiarism checking requires a free account — the remover tool stays open to everyone.
            </p>
          ) : null}

          {status === "idle" && !result ? <IdleResultCard hint={`Add at least ${MIN_WORDS} words and scan to see your similarity report.`} /> : null}
        </form>
      ) : canUploadDocs ? (
        <div className="grid gap-4">
          <DocumentUpload
            file={docFile}
            onFile={(next) => {
              setDocFile(next);
              setResult(null);
              setError(null);
              setStatus("idle");
            }}
            disabled={status === "loading"}
            accentIconClass="bg-rose-50 text-rose-600"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">PDF, DOCX, DOC or TXT · up to 10 MB · 50,000 characters max</p>
            <Button
              type="button"
              size="sm"
              disabled={!docFile || status === "loading"}
              onClick={() => void runDocumentScan()}
              className="rounded-xl bg-rose-600 px-4 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700"
            >
              {status === "loading" ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  Scanning…
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={AiScanIcon} className="size-4" data-icon="inline-start" />
                  Scan document
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <UpgradeGate />
      )}

      {status === "loading" ? (
        <div className="mt-4">
          <LoadingCard
            active
            title={mode === "document" ? "Scanning your document" : "Scanning the web"}
            messages={mode === "document" ? DOC_LOADING_MESSAGES : LOADING_MESSAGES}
          />
        </div>
      ) : null}

      {status === "error" && error ? (
        <div className="mt-4">
          <ErrorCard
            message={error}
            onRetry={() => (mode === "document" ? void runDocumentScan() : void runScan())}
          />
        </div>
      ) : null}

      {status === "done" && result && verdict ? (
        <div className="mt-4 grid gap-4" aria-live="polite">
          <div className="grid items-center gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/6 sm:grid-cols-[auto_1fr]">
            <ScoreGauge value={result.similarityScore} label="Similar content" />
            <div>
              <VerdictBadge tone={verdict.tone}>{verdict.label}</VerdictBadge>
              <p className="mt-3 text-sm leading-6 text-slate-600">{result.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatChip label="Similar" value={`${Math.round(result.similarityScore)}%`} />
                <StatChip label="Original" value={`${Math.round(result.originalityScore)}%`} />
                <StatChip label="Sources matched" value={String(result.matches.length)} />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
              <p className="text-sm font-semibold text-slate-800">
                {result.extractedText ? "Extracted text, highlighted" : "Your text, highlighted"}
              </p>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="inline-block size-2.5 rounded-sm bg-rose-200" aria-hidden="true" />
                matched wording
              </span>
            </div>
            <div className="px-5 py-4">
              <HighlightedText text={scannedText} matches={result.matches} />
            </div>
          </div>

          {result.matches.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">
                  Matched sources <span className="font-normal text-slate-400">({result.matches.length})</span>
                </p>
              </div>
              <ul className="divide-y divide-slate-100">
                {result.matches.map((match) => (
                  <li key={match.url} className="flex flex-wrap items-start gap-4 px-5 py-4 sm:flex-nowrap">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-sm font-bold uppercase text-rose-600">
                      {match.domain.replace(/^www\./, "").charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <a
                        href={match.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-rose-700"
                      >
                        <span className="truncate">{match.title || match.domain}</span>
                        <HugeiconsIcon
                          icon={ArrowUpRightIcon}
                          className="size-3.5 shrink-0 text-slate-400 transition-colors group-hover/link:text-rose-600"
                        />
                      </a>
                      <p className="mt-0.5 truncate text-xs text-slate-400">{match.domain.replace(/^www\./, "")}</p>
                      {match.matchedSegments.slice(0, 2).map((segment) => (
                        <p key={segment} className="mt-1.5 truncate text-xs italic text-slate-500">
                          “{segment.length > 90 ? `${segment.slice(0, 90)}…` : segment}”
                        </p>
                      ))}
                    </div>
                    <div className="w-28 shrink-0">
                      <p className="text-right text-sm font-bold tabular-nums text-slate-800">
                        {Math.round(match.similarity)}%
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-rose-500"
                          style={{ width: `${Math.max(4, Math.min(100, match.similarity))}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 px-5 py-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="text-sm leading-6 text-emerald-900">
                No matching sources found — this text looks original against the live web.
              </p>
            </div>
          )}

          <p className="text-center text-xs text-slate-400">
            Heuristic scan via live web search. Similarity scores are estimates, not a legal determination.
          </p>
        </div>
      ) : null}
    </ToolShell>
  );
}

function IdleResultCard({ hint }: { hint: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-rose-100 bg-slate-950 shadow-xl shadow-rose-950/10">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">Scan results</p>
          <p className="mt-0.5 text-xs text-slate-400">Your report will appear here</p>
        </div>
        <HugeiconsIcon icon={AiScanIcon} className="size-5 text-slate-600" />
      </div>
      <div className="grid min-h-40 place-items-center px-5 py-4">
        <p className="text-sm text-slate-600">{hint}</p>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-xl bg-slate-50 px-3 py-2">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="block text-sm font-bold text-slate-800">{value}</span>
    </span>
  );
}
