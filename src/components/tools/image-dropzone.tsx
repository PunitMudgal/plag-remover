"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export const IMAGE_ACCEPT = ACCEPTED_TYPES.join(",");
export const IMAGE_MAX_MB = 8;

function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only PNG, JPG and WebP images are supported.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `Image must be smaller than ${IMAGE_MAX_MB} MB.`;
  }
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Image picker with drag & drop, click-to-browse, and clipboard paste.
 * Validates type and size client-side and renders a preview card with
 * file metadata, plus replace/remove actions.
 */
export function ImageDropzone({
  file,
  onFile,
  disabled = false,
}: {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);

  const accept = useCallback(
    (candidate: File | null) => {
      if (!candidate) return;
      const message = validateImage(candidate);
      if (message) {
        setError(message);
        onFile(null);
        return;
      }
      setError(null);
      setDimensions(null);
      onFile(candidate);
    },
    [onFile],
  );

  // Accept images pasted straight from the clipboard.
  useEffect(() => {
    if (disabled) return;
    const onPaste = (e: ClipboardEvent) => {
      const pasted = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
      if (pasted) accept(pasted);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [accept, disabled]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openPicker = () => {
    setError(null);
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          accept(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      {file && previewUrl ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6">
          <div className="flex items-center justify-center bg-slate-50 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a remote asset */}
            <img
              src={previewUrl}
              alt={file.name}
              onLoad={(e) => setDimensions({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              className="max-h-80 rounded-2xl object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {formatBytes(file.size)}
                {dimensions ? ` · ${dimensions.w} × ${dimensions.h} px` : ""}
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
                onClick={() => {
                  onFile(null);
                  setDimensions(null);
                }}
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
          <span className="grid size-14 place-items-center rounded-2xl bg-violet-50 text-violet-600">
            <HugeiconsIcon icon={CloudUploadIcon} className="size-7" />
          </span>
          <span className="text-base font-semibold text-slate-800">
            {dragging ? "Drop the image here" : "Drag & drop your image here"}
          </span>
          <span className="text-sm text-slate-500">
            or click to browse — you can also paste from the clipboard
          </span>
          <span className="text-xs text-slate-400">PNG, JPG or WebP · up to {IMAGE_MAX_MB} MB</span>
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
