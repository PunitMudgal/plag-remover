import type { ReactNode } from "react";

/**
 * Page scaffold shared by every tool page: the lavender canvas, blurred
 * background orbs, and centered hero (eyebrow, headline, description).
 * Keeps all tool pages visually consistent with the rest of the site.
 */
export function ToolShell({
  eyebrow,
  title,
  description,
  children,
  contentClassName = "max-w-3xl",
  footer,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  /** Width of the content column, e.g. "max-w-3xl" or "max-w-5xl". */
  contentClassName?: string;
  footer?: string;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <section id="tool" className={`mx-auto flex w-full ${contentClassName} flex-1 flex-col justify-center py-12`}>
          <div className="mb-9 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">{eyebrow}</p>
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl">{title}</h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-500">{description}</p>
          </div>
          {children}
        </section>

        {footer ? <footer className="pb-2 text-center text-xs text-slate-400">{footer}</footer> : null}
      </div>
    </main>
  );
}
