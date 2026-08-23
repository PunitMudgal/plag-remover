"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

/** Inline error card shown when a tool run fails, with an optional retry. */
export function ErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xl shadow-slate-900/6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Something went wrong</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>
          {onRetry ? (
            <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
