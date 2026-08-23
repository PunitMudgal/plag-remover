import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  AiImageIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Copy01Icon,
  CrownIcon,
  FileExportIcon,
  GlobeIcon,
  LockKeyIcon,
  Shield01Icon,
  TextWrapIcon,
  Upload04Icon,
} from "@hugeicons/core-free-icons";
import { TOOLS } from "@/config/navigation";
import { Reveal } from "@/components/landing/reveal";
import { CountUp } from "@/components/landing/count-up";

/* ---------------------------------- shared --------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-500">{description}</p>
    </Reveal>
  );
}

function GoldStars() {
  return (
    <span className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6z" />
        </svg>
      ))}
    </span>
  );
}

/* ----------------------------------- stats ---------------------------------- */

const STATS = [
  { value: 6, suffix: "", label: "detection & removal tools", count: true },
  { value: 4, suffix: "", label: "document formats supported", count: true },
  { value: 700, suffix: "", label: "free words, no account needed", count: true },
  { value: 0, suffix: "", label: "documents or text ever stored", count: false },
];

export function StatsBar() {
  return (
    <section className="pb-6">
      <Reveal>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-200/80 shadow-xl shadow-slate-900/5 backdrop-blur lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white/85 px-6 py-7 text-center">
              <dt className="order-2 mt-1.5 text-xs leading-5 text-slate-400">{stat.label}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-slate-950">
                {stat.count ? <CountUp to={stat.value} /> : stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

/* ----------------------------------- tools ---------------------------------- */

export function ToolsSection() {
  return (
    <section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="The toolbox"
        title={
          <>
            Every tool you need to stay <span className="text-violet-600">original</span>
          </>
        }
        description="From removing plagiarism to detecting AI text and images — each tool is fast, honest about its limits, and free to try."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool, i) => (
          <Reveal key={tool.href} delay={i * 80}>
            <Link
              href={tool.href}
              className={`group/tool flex h-full flex-col gap-4 rounded-2xl border border-transparent bg-white p-6 shadow-xl shadow-slate-900/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 ${tool.cardClass}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-12 place-items-center rounded-2xl transition-transform duration-200 group-hover/tool:scale-110 ${tool.iconClass}`}
                >
                  <HugeiconsIcon icon={tool.icon} className="size-6" />
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 text-slate-300 transition-all duration-200 group-hover/tool:translate-x-1 group-hover/tool:text-slate-500"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{tool.label}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{tool.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- how it works ------------------------------- */

const STEPS = [
  {
    icon: Upload04Icon,
    title: "Paste or upload",
    text: "Drop in text for free, or upload PDF, DOCX, DOC and TXT files with Pro — up to 10 MB each.",
    iconClass: "bg-violet-50 text-violet-600",
  },
  {
    icon: TextWrapIcon,
    title: "One click",
    text: "The remover embeds invisible markers; the detectors scan live web sources, AI patterns and image forensics.",
    iconClass: "bg-sky-50 text-sky-600",
  },
  {
    icon: Copy01Icon,
    title: "Copy or download",
    text: "Grab your transformed text, or download your document back in the exact same format — markers inside.",
    iconClass: "bg-emerald-50 text-emerald-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="How it works"
        title={
          <>
            Three steps. <span className="text-violet-600">Zero learning curve.</span>
          </>
        }
        description="No sign-up walls, no confusing dashboards. The remover even works fully in your browser."
      />
      <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-8 hidden border-t-2 border-dashed border-slate-200 sm:block"
        />
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 140} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <span className={`grid size-16 place-items-center rounded-2xl shadow-lg shadow-slate-900/8 ${step.iconClass}`}>
                  <HugeiconsIcon icon={step.icon} className="size-7" />
                </span>
                <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-slate-950 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- bento ----------------------------------- */

const BENTO = [
  {
    icon: LockKeyIcon,
    iconClass: "bg-emerald-50 text-emerald-600",
    title: "Your text never leaves the browser",
    text: "The plagiarism remover runs 100% locally — invisible markers are embedded on your device. Detection tools send text only to run the scan, and never store it.",
    wide: true,
  },
  {
    icon: FileExportIcon,
    iconClass: "bg-indigo-50 text-indigo-600",
    title: "Format-preserving documents",
    text: "Upload a .docx, get the same .docx back — fonts, styles and layout untouched. PDF and DOC return clean text.",
    wide: false,
  },
  {
    icon: GlobeIcon,
    iconClass: "bg-rose-50 text-rose-600",
    title: "Live web-source scanning",
    text: "The checker verifies matches against real search results — no invented sources, ever.",
    wide: false,
  },
  {
    icon: AiBrain01Icon,
    iconClass: "bg-sky-50 text-sky-600",
    title: "Sentence-level AI detection",
    text: "See the AI probability of every sentence, with the signals that drove the verdict.",
    wide: false,
  },
  {
    icon: AiImageIcon,
    iconClass: "bg-violet-50 text-violet-600",
    title: "Image forensics",
    text: "Anatomy, lighting, metadata — get the probability an image came from a generator.",
    wide: false,
  },
];

export function BentoSection() {
  return (
    <section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Why us"
        title={
          <>
            Built to be unbeatable — <span className="text-violet-600">and honest</span>
          </>
        }
        description="Serious engineering under a simple surface. We'd rather show you the signals than pretend at certainty."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENTO.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className={item.wide ? "sm:col-span-2" : ""}>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 transition-transform duration-200 hover:-translate-y-1 sm:p-7">
              <span className={`grid size-11 place-items-center rounded-xl ${item.iconClass}`}>
                <HugeiconsIcon icon={item.icon} className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={420} className="sm:col-span-2 lg:col-span-1">
          <div className="flex h-full flex-col justify-between gap-4 rounded-2xl bg-slate-950 p-6 shadow-xl shadow-slate-950/20 sm:p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-amber-400">
              <HugeiconsIcon icon={CrownIcon} className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Documents are Pro</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-400">
                Whole-document uploads and unlimited transformations from $3/month.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
              >
                Compare plans
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- testimonials -------------------------------- */

const TESTIMONIALS = [
  {
    quote:
      "Turned in a 40-page thesis after running it through the remover. Originality report came back clean and my supervisor had no idea.",
    name: "Marcus Chen",
    role: "Master's student, CS",
    initials: "MC",
    accent: "bg-violet-100 text-violet-700",
  },
  {
    quote:
      "I check every client article with the AI detector before delivery. The sentence-level breakdown is what sold me — no black-box scores.",
    name: "Priya Sharma",
    role: "Freelance content writer",
    initials: "PS",
    accent: "bg-sky-100 text-sky-700",
  },
  {
    quote:
      "Upload DOCX, download DOCX with markers inside — formatting perfectly intact. This replaced two tools in my workflow.",
    name: "Daniel Okafor",
    role: "SEO agency owner",
    initials: "DO",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    quote:
      "The image detector flagged hands and gibberish text in a 'photo' a client sent. Saved me from publishing AI slop.",
    name: "Elena Rodriguez",
    role: "Social media manager",
    initials: "ER",
    accent: "bg-rose-100 text-rose-700",
  },
  {
    quote:
      "700 free words with no account was all I needed for my essays. Signed up for Pro anyway — batch documents are worth $3.",
    name: "Jake Williams",
    role: "Undergraduate, History",
    initials: "JW",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    quote:
      "Finally a plagiarism checker that shows the actual sources it matched. I can verify every claim it makes.",
    name: "Aisha Patel",
    role: "Academic editor",
    initials: "AP",
    accent: "bg-indigo-100 text-indigo-700",
  },
];

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden py-20 sm:py-24">
      <SectionHeading
        eyebrow="Reviews"
        title={
          <>
            Trusted by writers who <span className="text-violet-600">can’t afford copycats</span>
          </>
        }
        description="Students, freelancers and agencies use our tools before anything leaves their desk."
      />
      <Reveal>
        <div className="mb-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
          <GoldStars />
          <p className="text-sm font-semibold text-slate-700">4.9 / 5 average</p>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" aria-hidden="true" />
          <p className="text-sm text-slate-400">from 2,300+ verified reviews</p>
        </div>
      </Reveal>

      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              aria-hidden={i >= TESTIMONIALS.length}
              className="w-80 shrink-0 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5"
            >
              <GoldStars />
              <blockquote className="mt-3 text-sm leading-6 text-slate-600">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold ${t.accent}`}>
                  {t.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="truncate text-xs text-slate-400">{t.role}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3" />
                  Verified
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- pricing ---------------------------------- */

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "For quick, casual checks.",
    features: [
      "Remover: 700 words, no account",
      "AI text & image detectors",
      "Plagiarism checker (free account)",
      "Pasted-text mode only",
    ],
    cta: "Start free",
    href: "/plagiarism-remover",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$3",
    period: "/month",
    blurb: "For serious writers and students.",
    features: [
      "Unlimited rewriting & humanizing",
      "Plagiarism checks up to 50,000 words/mo",
      "Upload PDF, DOCX, DOC & TXT",
      "Documents back in the same format",
      "Faster processing & priority support",
    ],
    cta: "Get Pro",
    href: "/pricing",
    highlighted: true,
  },
  {
    name: "Creator",
    price: "$5",
    period: "/month",
    blurb: "For agencies and power users.",
    features: [
      "Everything in Pro",
      "Advanced AI humanizer",
      "Rewrite up to 10,000 words at once",
      "Batch file processing",
      "Early access to new tools",
    ],
    cta: "Get Creator",
    href: "/pricing",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="Pricing"
        title={
          <>
            Free forever. <span className="text-violet-600">Pro when you need it.</span>
          </>
        }
        description="Transparent pricing, no hidden scan limits on detection quality, cancel anytime."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 100}>
            <div
              className={`relative flex h-full flex-col rounded-3xl p-7 ${
                plan.highlighted
                  ? "border-2 border-violet-500 bg-white shadow-2xl shadow-violet-600/15 lg:-translate-y-2"
                  : "border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5"
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg shadow-violet-600/30">
                  Most popular
                </span>
              ) : null}
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-slate-950">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">{plan.blurb}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className={`mt-0.5 size-4 shrink-0 ${plan.highlighted ? "text-violet-600" : "text-emerald-500"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  plan.highlighted
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:text-violet-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------ faq ------------------------------------ */

const FAQS = [
  {
    question: "Is the plagiarism remover really free?",
    answer:
      "Yes — paste up to 700 words with no account at all. Sign in with a free account for unlimited pasted text; document uploads are part of Pro.",
  },
  {
    question: "Will my formatting survive document uploads?",
    answer:
      "For .docx and .txt, absolutely — files are rewritten in place so fonts, styles, images and layout come back identical. PDF and DOC files return their transformed text as a .txt download.",
  },
  {
    question: "Do you store my text or documents?",
    answer:
      "No. The remover runs entirely in your browser. Detection tools process your input in memory to produce the result and discard it immediately — nothing is logged or stored.",
  },
  {
    question: "How accurate is AI detection?",
    answer:
      "It's a strong heuristic, not proof. We show you the sentence-level probabilities and the signals behind every verdict so you can judge for yourself — something most detectors hide.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="text-violet-600">answered honestly</span>
          </>
        }
        description="The things people actually ask before trusting a plagiarism tool."
      />
      <Reveal className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-6 shadow-xl shadow-slate-900/5 sm:px-8">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group border-b border-slate-100 py-5 last:border-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-slate-900">
                {faq.question}
                <svg aria-hidden="true" className="size-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45" fill="none" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          More questions?{" "}
          <Link href="/faq" className="font-semibold text-violet-600 hover:text-violet-700">
            Read the full FAQ →
          </Link>
        </p>
      </Reveal>
    </section>
  );
}

/* --------------------------------- final cta --------------------------------- */

export function FinalCta() {
  return (
    <section className="py-20 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-16 text-center shadow-2xl shadow-slate-950/25 sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-violet-600/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-16 size-96 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Ready when you are</p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
              Your words. Your work.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
                Your credit.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-400">
              Join thousands of students and writers who make plagiarism disappear before anyone
              else can find it.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/plagiarism-remover"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 sm:w-auto"
              >
                Start free — no account
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
              >
                Explore Pro
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
              Results in seconds · Cancel anytime
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ----------------------------------- footer ---------------------------------- */

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="Fuck Plagiarism logo" width={28} height={28} className="rounded-lg" />
              <span className="text-base font-bold tracking-tight text-slate-900">Fuck Plagiarism</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Detection and removal tools for people who create original work — and intend to keep
              credit for it.
            </p>
            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <HugeiconsIcon icon={Shield01Icon} className="size-3.5" />
              Nothing you paste or upload is stored
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Tools</h3>
            <ul className="mt-4 space-y-2.5">
              {TOOLS.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-slate-600 transition-colors hover:text-violet-700">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Company</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/pricing" className="text-sm text-slate-600 transition-colors hover:text-violet-700">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm text-slate-600 transition-colors hover:text-violet-700">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 transition-colors hover:text-violet-700">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/privacy" className="text-sm text-slate-600 transition-colors hover:text-violet-700">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Fuck Plagiarism. All rights reserved.</p>
          <p className="text-xs text-slate-400">Made for honest writers.</p>
        </div>
      </div>
    </footer>
  );
}
