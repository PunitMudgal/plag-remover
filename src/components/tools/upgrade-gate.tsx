"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";

/**
 * Shown in document mode to signed-out and free users: explains that
 * documents are a Pro feature and links to the pricing page.
 */
export function UpgradeGate() {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-xl shadow-slate-900/6">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
        <HugeiconsIcon icon={CrownIcon} className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
        Document mode is a Pro feature
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Upgrade to Pro or Creator to upload PDF, DOCX, DOC and TXT files — transform entire
        documents and get them back with formatting preserved.
      </p>
      <Link
        href="/pricing"
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition-colors hover:bg-violet-700"
      >
        Upgrade to Pro
      </Link>
      <p className="mt-3 text-xs text-slate-400">Pasted text stays free for everyone.</p>
    </div>
  );
}
