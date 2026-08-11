"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const INVISIBLE_MARKER = "\u200C\u200C";

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

export default function Home() {
  const [text, setText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [text]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setEncodedText("");
      return;
    }

    // Keep the original line breaks and spacing while adding the invisible marker.
    const data = trimmed
      .split(/(\s+)/)
      .map((part) => (/\s+/.test(part) ? part : part + INVISIBLE_MARKER))
      .join("");
    setEncodedText(data);
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-lg text-white shadow-lg shadow-slate-950/15">✦</div>
            <span className="text-sm font-semibold tracking-tight">Veiltext</span>
          </div>
          <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-500">Private by design</span>
        </header>

        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-12">
          <div className="mb-9 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">Invisible text utility</p>
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">Make words <span className="text-violet-600">unseen.</span></h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-500">Add invisible characters to your text, then copy it anywhere. Nothing is uploaded or stored.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <label htmlFor="source-text" className="text-sm font-semibold text-slate-800">Your text</label>
                <span className="text-xs text-slate-400">{wordCount} {wordCount === 1 ? "word" : "words"}</span>
              </div>
              <textarea
                id="source-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste something here..."
                className="min-h-48 w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-7 text-slate-800 outline-none placeholder:text-slate-300"
                spellCheck
              />
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                <span className="text-xs text-slate-400">Your text stays in this browser</span>
                <div className="flex gap-2">
                  {text && <Button type="button" variant="ghost" size="sm" onClick={() => { setText(""); setEncodedText(""); }}>Clear</Button>}
                  <Button type="submit" size="sm" className="rounded-xl bg-violet-600 px-4 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700">Transform <span aria-hidden="true">→</span></Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-violet-100 bg-slate-950 shadow-xl shadow-violet-950/10">
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
          </form>
        </section>

        <footer className="pb-2 text-center text-xs text-slate-400">Works locally in your browser · No accounts · No tracking</footer>
      </div>
    </main>
  );
}
