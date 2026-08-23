"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelCircleIcon,
  CloudUploadIcon,
  Doc01Icon,
  File01Icon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { docValidationError, extensionOf } from "@/lib/documents/constants";

export const DOC_ACCEPT = ".txt,.docx,.doc,.pdf";

function iconFor(ext: string) {
  if (ext === "pdf") return Pdf01Icon;
  if (ext === "docx" || ext === "doc") return Doc01Icon;
  return File01Icon;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Document picker with drag & drop, click-to-browse, and clipboard paste for
 * .txt/.docx/.doc/.pdf files up to 10 MB.
 */
export function DocumentUpload({
  file,
  onFile,
  disabled = false,
  accentIconClass = "bg-violet-50 text-violet-600",
}: {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
  accentIconClass?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = useCallback(
    (candidate: File | null) => {
      if (!candidate) return;
      const message = docValidationError(candidate.name, candidate.size);
      if (message) {
        setError(message);
        onFile(null);
        return;
      }
      setError(null);
      onFile(candidate);
    },
    [onFile],
  );

  useEffect(() => {
    if (disabled) return;
    const onPaste = (e: ClipboardEvent) => {
      const pasted = Array.from(e.clipboardData?.files ?? []).find((f) => /\.[a-z0-9]+$/i.test(f.name));
      if (pasted) accept(pasted);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [accept, disabled]);

  const openPicker = () => {
    setError(null);
    inputRef.current?.click();
  };

  const ext = file ? extensionOf(file.name) : "";

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={DOC_ACCEPT}
        className="hidden"
        onChange={(e) => {
          accept(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      {file ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
          <div className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${accentIconClass}`}>
              <HugeiconsIcon icon={iconFor(ext)} className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">
                {ext} · {formatBytes(file.size)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={openPicker} disabled={disabled}>
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => onFile(null)}
                disabled={disabled}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!disabled) accept(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`grid w-full place-items-center gap-3 rounded-3xl border-2 border-dashed bg-white/70 px-6 py-14 text-center shadow-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-violet-500/30 disabled:opacity-60 ${
            dragging ? "border-violet-400 bg-violet-50/70" : "border-slate-200 hover:border-violet-300 hover:bg-violet-50/40"
          }`}
        >
          <span className={`grid size-14 place-items-center rounded-2xl ${accentIconClass}`}>
            <HugeiconsIcon icon={CloudUploadIcon} className="size-7" />
          </span>
          <span className="text-base font-semibold text-slate-800">
            {dragging ? "Drop your document here" : "Drag & drop your document here"}
          </span>
          <span className="text-sm text-slate-500">
            or click to browse — PDF, DOCX, DOC and TXT files
          </span>
          <span className="text-xs text-slate-400">Up to 10 MB · Pro feature</span>
        </button>
      )}

      {error ? (
        <p role="alert" className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-rose-600">
          <HugeiconsIcon icon={CancelCircleIcon} className="size-4" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
