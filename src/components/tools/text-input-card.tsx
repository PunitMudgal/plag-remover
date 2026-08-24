"use client";

import { useMemo, type ReactNode } from "react";

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/**
 * The bordered text-area card shared by the text tools: header row with a
 * live word counter, body textarea, footer row with a note and actions.
 */
export function TextInputCard({
  id,
  label,
  value,
  onChange,
  placeholder = "Type or paste something here...",
  footerNote,
  counterMax,
  minWords,
  children,
  textareaClassName = "min-h-48",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  footerNote?: ReactNode;
  /** When set, the counter renders as "n / max words". */
  counterMax?: number;
  /** When set, the counter hints how many more words are needed. */
  minWords?: number;
  children?: ReactNode;
  textareaClassName?: string;
}) {
  const wordCount = useMemo(() => countWords(value), [value]);

  const counter = counterMax ? (
    <span className={wordCount > counterMax ? "font-semibold text-amber-600" : undefined}>
      {wordCount} / {counterMax} words
    </span>
  ) : (
    <span>
      {wordCount} {wordCount === 1 ? "word" : "words"}
      {minWords && wordCount > 0 && wordCount < minWords ? (
        <span className="text-slate-300"> · {minWords - wordCount} more needed</span>
      ) : null}
    </span>
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
        <span className="text-xs text-slate-400">{counter}</span>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck
        className={`${textareaClassName} w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-7 text-slate-800 outline-none placeholder:text-slate-300`}
      />
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
        {footerNote ? <span className="text-xs text-slate-400">{footerNote}</span> : <span />}
        {children ? <div className="flex gap-2">{children}</div> : null}
      </div>
    </div>
  );
}
