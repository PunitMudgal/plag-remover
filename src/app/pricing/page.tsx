"use client";

import { PricingTable } from "@clerk/nextjs";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 text-violet-600"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        {/* Header */}
        <section className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
            Pricing
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Simple, transparent <span className="text-violet-600">pricing</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-500">
            Start free and upgrade when you need more. Plans are billed securely
            through Clerk and can be changed or cancelled anytime.
          </p>
        </section>

        {/* Clerk pricing table */}
        <section className="mt-12">
          <PricingTable
            for="user"
            highlightedPlan="Pro"
            // ctaPosition="bottom"
            // collapseFeatures
            newSubscriptionRedirectUrl="/"
            fallback={
              <div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                aria-hidden="true"
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/6"
                  />
                ))}
              </div>
            }
          />
        </section>

        {/* Feature note */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "No uploads",
                text: "Your text is processed locally and never stored.",
              },
              {
                title: "Instant",
                text: "Results appear immediately as you transform your text.",
              },
              {
                title: "Cancel anytime",
                text: "Upgrade, downgrade, or cancel with a couple of clicks.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <CheckIcon />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
