"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/tools/tool-shell";
import { TextInputCard, countWords } from "@/components/tools/text-input-card";
import { LoadingCard } from "@/components/tools/loading-card";
import { ErrorCard } from "@/components/tools/error-card";
import { SignInGateButton } from "@/components/tools/sign-in-gate";
import { hasPaidPlan } from "@/config/billing";

type Accent = "violet" | "amber";

const ACCENTS: Record<
  Accent,
  { eyebrow: string; button: string; resultBorder: string; pillActive: string }
> = {
  violet: {
    eyebrow: "text-violet-600",
    button:
      "rounded-xl bg-violet-600 px-4 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700",
    resultBorder: "border-violet-100 shadow-violet-950/10",
    pillActive: "bg-violet-600 text-white shadow-md shadow-violet-600/20",
  },
  amber: {
    eyebrow: "text-amber-600",
    button:
      "rounded-xl bg-amber-500 px-4 text-white shadow-md shadow-amber-500/20 hover:bg-amber-600",
    resultBorder: "border-amber-100 shadow-amber-950/10",
    pillActive: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
  },
};

function CopyIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="M8 8V6.8A2.8 2.8 0 0 1 10.8 4h6.4A2.8 2.8 0 0 1 20 6.8v6.4a2.8 2.8 0 0 1-2.8 2.8H16M6.8 8h6.4A2.8 2.8 0 0 1 16 10.8v6.4a2.8 2.8 0 0 1-2.8 2.8H6.8A2.8 2.8 0 0 1 4 17.2v-6.4A2.8 2.8 0 0 1 6.8 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

/**
 * Shared client for the streaming rewrite tools (AI-to-human converter,
 * paraphraser): input card, mode pills, and a dark result card that fills in
 * live as the rewrite streams from the server.
 */
export function RewriteTool({
  eyebrow,
  title,
  description,
  footer,
  accent,
  apiPath,
  inputLabel,
  placeholder,
  freeWordCap,
  paidWordCap,
  submitLabel,
  busyLabel,
  loadingTitle,
  loadingMessages,
  optionsLabel,
  options,
  resultLabel,
  idleHint,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  footer: string;
  accent: Accent;
  apiPath: string;
  inputLabel: string;
  placeholder: string;
  freeWordCap: number;
  paidWordCap: number;
  submitLabel: string;
  busyLabel: string;
  loadingTitle: string;
  loadingMessages: readonly string[];
  optionsLabel: string;
  options: readonly { value: string; label: string }[];
  resultLabel: string;
  idleHint: string;
}) {
  const palette = ACCENTS[accent];
  const { isSignedIn, isLoaded, has } = useAuth();
  const paid = isLoaded && isSignedIn && hasPaidPlan(has);

  const [text, setText] = useState("");
  const [option, setOption] = useState(options[0]?.value ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "streaming" | "done" | "error">("idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const wordCount = countWords(text);
  const cap = paid ? paidWordCap : freeWordCap;
  const overCap = wordCount > cap;
  const canRun = wordCount >= 5 && !overCap;
  const busy = status === "loading" || status === "streaming";

  useEffect(() => {
    if (status === "streaming" && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, status]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const run = async () => {
    setStatus("loading");
    setError(null);
    setOutput("");
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), option }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The rewrite failed. Please try again.");
      }
      setStatus("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The rewrite failed. Please try again.");
      setStatus("error");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignedIn || !canRun || busy) return;
    void run();
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = output;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } finally {
        document.body.removeChild(el);
      }
    }
  };

  return (
    <ToolShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      contentClassName="max-w-4xl"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <TextInputCard
          id="rewrite-text"
          label={inputLabel}
          value={text}
          onChange={setText}
          placeholder={placeholder}
          minWords={5}
          counterMax={isSignedIn ? cap : undefined}
          textareaClassName="min-h-56"
          footerNote={
            paid
              ? `Up to ${paidWordCap.toLocaleString()} words per run`
              : `Free plan: up to ${freeWordCap.toLocaleString()} words per run`
          }
        >
          {text ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setText("");
                setOutput("");
                setStatus("idle");
                setError(null);
              }}
            >
              Clear
            </Button>
          ) : null}
          {isSignedIn ? (
            <Button
              type="submit"
              size="sm"
              disabled={!canRun || busy}
              className={palette.button}
            >
              {busy ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  {busyLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          ) : (
            <SignInGateButton className={palette.button}>Sign in to {submitLabel.toLowerCase()}</SignInGateButton>
          )}
        </TextInputCard>

        <div className="flex flex-col items-center gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {optionsLabel}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {options.map((opt) => {
              const active = opt.value === option;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setOption(opt.value)}
                  disabled={busy}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 disabled:opacity-60 ${
                    active
                      ? `border-transparent ${palette.pillActive}`
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {isSignedIn && !paid && overCap ? (
          <p role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            The free plan covers up to {freeWordCap.toLocaleString()} words per run.{" "}
            <Link href="/pricing" className="font-semibold underline underline-offset-2">
              Upgrade to Pro
            </Link>{" "}
            for up to {paidWordCap.toLocaleString()}.
          </p>
        ) : null}

        {!isSignedIn && wordCount > 0 ? (
          <p className="text-center text-xs text-slate-400">
            Rewriting requires a free account — the plagiarism remover stays open to everyone.
          </p>
        ) : null}

        {status === "loading" ? (
          <LoadingCard active accent={accent} title={loadingTitle} messages={loadingMessages} />
        ) : null}

        {status === "error" && error ? <ErrorCard message={error} onRetry={() => void run()} /> : null}

        {status !== "loading" ? (
          <div className={`overflow-hidden rounded-3xl border bg-slate-950 shadow-xl ${palette.resultBorder}`}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">{resultLabel}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {status === "streaming"
                    ? "Writing…"
                    : status === "done"
                      ? "Ready to copy"
                      : "Your result will appear here"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {status === "streaming" ? (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-violet-400" aria-hidden="true" />
                    live
                  </span>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={status !== "done" || !output}
                  onClick={handleCopy}
                  className="rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <div
              ref={outputRef}
              aria-live="polite"
              className="max-h-96 min-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word px-5 py-4 text-[15px] leading-7 text-slate-300"
            >
              {output || <span className="text-slate-600">{idleHint}</span>}
            </div>
          </div>
        ) : null}
      </form>
    </ToolShell>
  );
}
