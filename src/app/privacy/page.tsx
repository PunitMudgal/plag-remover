import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Fuck Plagiarism handles your data when you use our plagiarism remover, text paraphraser, and AI content humanizer.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "Introduction",
    body: [
      "This Privacy Policy explains how Fuck Plagiarism (\"we\", \"our\", or \"us\") collects, uses, and protects your information when you use our website and tools, including the plagiarism remover, text paraphraser, and AI content humanizer.",
      "By using our services, you agree to the practices described in this policy. We are committed to keeping your information private and secure.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "We collect as little information as possible. Most of our core transformation tools work entirely in your browser and do not require you to create an account.",
      "When you choose to sign in, we receive basic account information from our authentication provider (Clerk), such as your name, email address, and profile picture. If you subscribe to a paid plan, billing information is handled securely by our payment provider.",
      "We may also collect basic technical data such as your browser type, device type, and pages visited, in aggregated form, to understand how our service is used and to improve it.",
    ],
  },
  {
    title: "Your Text Stays With You",
    body: [
      "The plagiarism remover is designed to process text locally in your browser. We do not upload, store, or share the text you paste into it. Guests can transform up to 700 words; signed-in accounts are unlimited.",
      "The detection tools (plagiarism checker, AI text detector, and AI image detector) require a free account. When you run them, your text or image is sent securely to our server and passed to Google's Gemini API for analysis. It is used only to produce your result — we do not store, log, or share it afterwards.",
      "Pro users can also upload documents (PDF, DOCX, DOC, TXT) for checking or transformation. Uploaded files are processed in memory to extract and transform their text, then discarded — we never store the files or their contents.",
      "Your content is never saved on our servers, and we cannot read, sell, or use the content you analyze or transform.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use the information we collect to provide and maintain our services, process your account and subscriptions, respond to your requests, improve our products, and keep the service secure.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    body: [
      "We use cookies and similar technologies through our authentication provider to keep you signed in and to remember your preferences. These are necessary for features like secure sign-in and usage measurement.",
      "You can control or disable cookies through your browser settings, although some parts of the service may not function properly without them.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "We use trusted third-party services to run parts of our website:",
      "• Clerk provides authentication and, when enabled, billing/payment processing. Their handling of your data is governed by their own privacy policy.",
      "• Google (Gemini API) processes the text and images you submit to the detection tools to generate your analysis results. Their handling of your data is governed by Google's terms and privacy policy.",
      "• We do not share the text you transform with any third party.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction. Your account data is protected via secure connections and our providers follow industry-standard security practices.",
      "Because transformation happens locally in your browser, there is little personal data at risk to begin with.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "Depending on where you live, you may have rights to access, correct, or delete your personal information, and to object to certain processing. You can exercise these rights by contacting us using the details below.",
      "You can also delete your account at any time through your account settings.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can remove it.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. We will post any changes on this page and update the effective date below. Continued use of the service after changes are posted constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have any questions about this Privacy Policy or how we handle your data, please contact us through the contact page on our website.",
    ],
  },
];
export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">Legal</p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">Last updated: February 2026</p>
        </header>

        {/* Content */}
        <div className="mt-12 space-y-8">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/6 sm:p-8"
            >
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-8 text-center text-xs leading-6 text-slate-400">
          <p>© {new Date().getFullYear()} Fuck Plagiarism. All rights reserved.</p>
          <p className="mt-1">Your privacy matters to us. Questions? Reach out via the contact page.</p>
        </footer>
      </div>
    </main>
  );
}

