import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#f7f8fc] px-5 text-slate-950">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative text-center">
        <p className="text-7xl font-bold tracking-tight text-violet-600 sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          This page plagiarized itself out of existence.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          The page you’re looking for doesn’t exist or has moved. Everything original is still
          one click away.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-colors hover:bg-violet-700"
          >
            Back to home
          </Link>
          <Link
            href="/plagiarism-remover"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-6 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:border-violet-200 hover:text-violet-700"
          >
            Try the remover
          </Link>
        </div>
      </div>
    </main>
  );
}
