import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Fuck Plagiarism",
  description:
    "Frequently asked questions about the Fuck Plagiarism plagiarism remover, text paraphraser, and AI content humanizer.",
};

const FAQS = [
  {
    question: "What is Fuck Plagiarism?",
    answer:
      "Fuck Plagiarism is a set of tools that help you make AI-generated or already-published text original. It includes a plagiarism remover, a text paraphraser, and an AI content humanizer.",
  },
  {
    question: "Is my text uploaded or stored?",
    answer:
      "No. Transformation happens entirely in your browser. We never upload, store, or share the text you paste into the tool.",
  },
  {
    question: "Do I need an account to use the tools?",
    answer:
      "You can use the core tools without an account. Creating a free account lets you unlock higher limits and manage your subscription.",
  },
  {
    question: "What is the free plan?",
    answer:
      "The free plan lets you transform a limited amount of text every month with no credit card required. You can upgrade anytime to unlock more capacity.",
  },
  {
    question: "Can I switch or cancel my plan at any time?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your subscription directly from your account at any time. Changes take effect on the next billing cycle.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Payments are processed securely by Clerk. Credit and debit cards are supported, and your billing details are protected.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "We support the latest versions of Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date for the best experience.",
  },
];
export default function FaqPage() {
  return (
    <main className="bg-white text-slate-950">
      <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
        {/* Header */}
        <header className="border-b border-slate-200 pb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            FAQ
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
            Everything you need to know about the plagiarism remover, text
            paraphraser, and AI content humanizer.
          </p>
        </header>

        {/* Questions */}
        <dl className="mt-8">
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              className={index > 0 ? "border-t border-slate-200" : ""}
            >
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-slate-900">
                  {faq.question}
                  <svg
                    aria-hidden="true"
                    className="size-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            </div>
          ))}
        </dl>

        {/* Still have questions */}
        <section className="mt-12 border border-slate-200 rounded-2xl bg-slate-50 px-6 py-6 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            Still have questions?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Reach out and we&rsquo;ll be happy to help. Contact us through the
            contact page or support channel.
          </p>
        </section>
      </div>
    </main>
  );
}

