"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ToolShell } from "@/components/tools/tool-shell";
import { TextInputCard } from "@/components/tools/text-input-card";
import { SignInGateButton } from "@/components/tools/sign-in-gate";
import { ModeTabs } from "@/components/tools/mode-tabs";
import { DocumentUpload } from "@/components/tools/document-upload";
import { UpgradeGate } from "@/components/tools/upgrade-gate";
import { LoadingCard } from "@/components/tools/loading-card";
import { ErrorCard } from "@/components/tools/error-card";
import { hasPaidPlan } from "@/config/billing";
import { insertInvisibleMarkers } from "@/lib/invisible";
import { extensionOf } from "@/lib/documents/constants";

/** Guests can transform up to this many words; signed-in users are unlimited. */
export const GUEST_WORD_LIMIT = 700;

const DOC_LOADING_MESSAGES = [
  "Reading your document",
  "Embedding invisible markers into every word",
  "Rebuilding your file",
] as const;

const TEXT_LOADING_MESSAGES = [
  "Scanning your text",
  "Embedding invisible markers into every word",
] as const;

/** How long the text-mode scan flourish runs before revealing the result. */
const TEXT_SCAN_MS = 1100;

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

function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const match = /filename="?([^";]+)"?/i.exec(header);
  return match ? match[1] : null;
}

export function PlagiarismRemoverClient() {
  const { isSignedIn, isLoaded, has } = useAuth();
  const [mode, setMode] = useState<"text" | "document">("text");

  const [text, setText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [docFile, setDocFile] = useState<File | null>(null);
  const [docStatus, setDocStatus] = useState<"idle" | "processing" | "error">("idle");
  const [docError, setDocError] = useState<string | null>(null);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  const canUploadDocs = isLoaded && isSignedIn && hasPaidPlan(has);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const overGuestLimit = !isSignedIn && wordCount > GUEST_WORD_LIMIT;

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || overGuestLimit || processing) {
      setEncodedText("");
      return;
    }
    setEncodedText("");
    setProcessing(true);
    window.setTimeout(() => {
      setEncodedText(insertInvisibleMarkers(trimmed));
      setProcessing(false);
    }, TEXT_SCAN_MS);
  };

  const handleCopy = async () => {
    if (!encodedText) return;
    try {
      await navigator.clipboard.writeText(encodedText);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = encodedText;
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

  const handleDocFile = (next: File | null) => {
    setDocFile(next);
    setDocError(null);
    setDownloadNote(null);
    setDocStatus("idle");
  };

  const runDocumentTransform = async () => {
    if (!docFile) return;
    setDocStatus("processing");
    setDocError(null);
    setDownloadNote(null);
    try {
      const body = new FormData();
      body.append("document", docFile);
      const res = await fetch("/api/tools/plagiarism-remover/document", { method: "POST", body });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The transform failed. Please try again.");
      }
      const blob = await res.blob();
      const filename =
        filenameFromDisposition(res.headers.get("content-disposition")) ??
        `transformed-${docFile.name}`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      setDocStatus("idle");
      setDownloadNote(
        `${filename} downloaded — open it and copy the text wherever you need it.`,
      );
    } catch (err) {
      setDocError(err instanceof Error ? err.message : "The transform failed. Please try again.");
      setDocStatus("error");
    }
  };

  const docExt = docFile ? extensionOf(docFile.name) : "";
  const docReturnsText = docExt === "pdf" || docExt === "doc";

  return (
    <ToolShell
      eyebrow="Plagiarism remover"
      title={
        <>
          Make words <span className="text-emerald-600">unseen.</span>
        </>
      }
      description="Remove plagiarism from your text or entire documents. Turn your AI-generated text original. Nothing is stored."
      footer={`Works locally in your browser · Free up to ${GUEST_WORD_LIMIT} words without an account · Documents with Pro`}
    >
      <div className="mb-6 flex justify-center">
        <ModeTabs
          value={mode}
          onChange={(next) => setMode(next as "text" | "document")}
          tabs={[
            { value: "text", label: "Paste text" },
            { value: "document", label: "Upload document", badge: "Pro" },
          ]}
        />
      </div>

      {mode === "text" ? (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <TextInputCard
            id="source-text"
            label="Your text"
            value={text}
            onChange={setText}
            placeholder="Type or paste something here..."
            counterMax={isSignedIn ? undefined : GUEST_WORD_LIMIT}
            footerNote={isSignedIn ? "Your text stays in this browser" : "Your text stays in this browser · unlimited when signed in"}
          >
            {text ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => { setText(""); setEncodedText(""); }}>
                Clear
              </Button>
            ) : null}
            {overGuestLimit ? (
              <SignInGateButton className="rounded-xl bg-emerald-600 px-4 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700">
                Sign in for unlimited
              </SignInGateButton>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!text.trim() || processing}
                className="rounded-xl bg-emerald-600 px-4 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
              >
                {processing ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                    Transforming…
                  </>
                ) : (
                  <>
                    Transform <span aria-hidden="true">→</span>
                  </>
                )}
              </Button>
            )}
          </TextInputCard>

          {overGuestLimit ? (
            <p role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
              Free guests can transform up to {GUEST_WORD_LIMIT} words — sign in with a free account for unlimited length.
            </p>
          ) : null}

          {processing ? (
            <LoadingCard
              active
              accent="emerald"
              intervalMs={450}
              title="Transforming your text"
              messages={TEXT_LOADING_MESSAGES}
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-slate-950 shadow-xl shadow-emerald-950/10">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">Transformed text</p>
                  <p className="mt-0.5 text-xs text-slate-400">{encodedText ? "Ready to copy" : "Your result will appear here"}</p>
                </div>
                <Button type="button" variant="secondary" size="sm" disabled={!encodedText} onClick={handleCopy} className="rounded-xl bg-white/10 text-white hover:bg-white/20">
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div aria-live="polite" className="min-h-48 whitespace-pre-wrap wrap-break-word px-5 py-4 text-[15px] leading-7 text-slate-300">
                {encodedText || <span className="text-slate-600">Transform your text to see the invisible characters at work.</span>}
              </div>
            </div>
          )}
        </form>
      ) : canUploadDocs ? (
        <div className="grid gap-4">
          <DocumentUpload
            file={docFile}
            onFile={handleDocFile}
            disabled={docStatus === "processing"}
            accentIconClass="bg-emerald-50 text-emerald-600"
          />

          {docFile ? (
            <p className="text-center text-xs text-slate-400">
              {docReturnsText
                ? "PDF and DOC files return the transformed text as a .txt download."
                : "Your file comes back in exactly the same format, markers embedded."}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">PDF, DOCX, DOC or TXT · up to 10 MB</p>
            <Button
              type="button"
              size="sm"
              disabled={!docFile || docStatus === "processing"}
              onClick={() => void runDocumentTransform()}
              className="rounded-xl bg-emerald-600 px-4 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
            >
              {docStatus === "processing" ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  Transforming…
                </>
              ) : (
                <>
                  Remove plagiarism <span aria-hidden="true">&amp;</span> download
                </>
              )}
            </Button>
          </div>

          {docStatus === "processing" ? (
            <LoadingCard active accent="emerald" title="Transforming your document" messages={DOC_LOADING_MESSAGES} />
          ) : null}

          {docStatus === "error" && docError ? (
            <ErrorCard message={docError} onRetry={() => void runDocumentTransform()} />
          ) : null}

          {downloadNote ? (
            <p role="status" className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-center text-sm text-emerald-800">
              <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0" aria-hidden="true">
                <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {downloadNote}
            </p>
          ) : null}
        </div>
      ) : (
        <UpgradeGate />
      )}
    </ToolShell>
  );
}
