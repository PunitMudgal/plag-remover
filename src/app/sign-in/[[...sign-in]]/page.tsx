import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In - Fuck Plagiarism",
};

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f7f8fc] px-5 py-16">
      <div className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account to get started.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/6 sm:p-8">
          <SignIn
            fallbackRedirectUrl="/"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                cardBox: "shadow-none",
                card: "shadow-none border-0 p-0",
                headerTitle: "text-lg font-semibold tracking-tight text-slate-950",
                headerSubtitle: "text-sm text-slate-500",
                formButtonPrimary:
                  "rounded-xl bg-violet-600 font-medium shadow-md shadow-violet-600/20 hover:bg-violet-700",
                formFieldInput:
                  "rounded-xl border-slate-200 bg-white text-slate-950 outline-none focus:ring-2 focus:ring-violet-600",
                formFieldLabel: "text-sm font-medium text-slate-800",
                dividerLine: "bg-slate-200",
                dividerText: "text-xs text-slate-400",
                socialButtonsBlockButton:
                  "rounded-xl border-slate-200 text-slate-800 hover:bg-slate-50",
                footerActionLink: "text-violet-600 hover:text-violet-700",
                footerActionText: "text-slate-500",
                footer: "mt-6",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
