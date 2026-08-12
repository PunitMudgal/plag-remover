"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, TOOLS } from "@/config/navigation";
import { cn } from "@/lib/utils";

/* ---------------------------------- Brand ---------------------------------- */

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" onClick={onNavigate}>
      <Image
        src="/logo.png"
        alt="Fuck Plagiarism logo"
        width={36}
        height={36}
        priority
        className="size-9 object-contain"
      />
      <span className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
        Fuck Plagiarism
      </span>
    </Link>
  );
}

/* ------------------------------ Navigation links --------------------------- */

type NavLinksProps = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
  /** Desktop mega menu state & handlers (used by the desktop variant only). */
  toolsOpen?: boolean;
  onToolsToggle?: () => void;
  onToolsMouseEnter?: () => void;
  onToolsMouseLeave?: () => void;
};

function NavLinks({
  variant,
  onNavigate,
  toolsOpen,
  onToolsToggle,
  onToolsMouseEnter,
  onToolsMouseLeave,
}: NavLinksProps) {
  if (variant === "desktop") {
    return (
      <nav className="hidden items-center gap-1 sm:flex">
        {/* Tools trigger — the mega menu itself is rendered by the navbar */}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={toolsOpen}
          aria-controls="tools-mega-menu"
          onClick={onToolsToggle}
          onMouseEnter={onToolsMouseEnter}
          onMouseLeave={onToolsMouseLeave}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            toolsOpen
              ? "bg-violet-50 text-violet-700"
              : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
          )}
        >
          Tools
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              "size-4 transition-transform duration-200",
              toolsOpen && "rotate-180"
            )}
          />
        </button>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      <MobileToolsSection onNavigate={onNavigate} />
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

/* ------------------------------ Mobile tools ------------------------------- */

function MobileToolsSection({ onNavigate }: { onNavigate?: () => void }) {
  const [toolsOpen, setToolsOpen] = useState(true);

  return (
    <div className="border-b border-slate-100 pb-2">
      <button
        type="button"
        aria-expanded={toolsOpen}
        onClick={() => setToolsOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
      >
        Tools
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn(
            "size-4 text-slate-400 transition-transform duration-200",
            toolsOpen && "rotate-180"
          )}
        />
      </button>

      {toolsOpen && (
        <div className="mt-1 flex flex-col gap-0.5 pb-1">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  tool.iconClass
                )}
              >
                <HugeiconsIcon icon={tool.icon} className="size-4" />
              </span>
              {tool.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Desktop tools mega menu ----------------------- */

function ToolsMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-6 pt-3 sm:px-8 lg:px-12">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
        <div className="p-6 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
                Tools
              </p>
              <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">
                Rewrite, humanize & refine your writing
              </h2>
            </div>
            <span className="hidden shrink-0 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 sm:inline-flex">
              {TOOLS.length} tools
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={onNavigate}
                className={cn(
                  "group/tool relative flex flex-col gap-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/5",
                  tool.cardClass
                )}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover/tool:scale-110",
                    tool.iconClass
                  )}
                >
                  <HugeiconsIcon icon={tool.icon} className="size-5" />
                </span>

                <span
                  aria-hidden
                  className="absolute right-3.5 top-3.5 -translate-x-1 text-slate-400 opacity-0 transition-all duration-200 group-hover/tool:translate-x-0 group-hover/tool:opacity-100"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </span>

                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-slate-900">
                    {tool.label}
                  </span>
                  <span className="text-xs leading-relaxed text-slate-500">
                    {tool.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Auth actions ------------------------------ */

type AuthActionsProps = {
  variant: "desktop" | "mobile";
};

function AuthActions({ variant }: AuthActionsProps) {
  const isDesktop = variant === "desktop";
  const userButtonAppearance = {
    elements: { avatarBox: "size-9 rounded-full" },
  };

  if (isDesktop) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Show when="signed-out">
          <SignInButton>
            <Button variant="ghost" className="text-slate-700 hover:text-violet-700">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className="rounded-full bg-violet-600 px-5 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700">
              Sign Up
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton appearance={userButtonAppearance} />
        </Show>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
      <Show when="signed-out">
        <SignInButton>
          <Button variant="outline" className="flex-1">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className="flex-1 rounded-full bg-violet-600 text-white shadow-md shadow-violet-600/20 hover:bg-violet-700">
            Sign Up
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div className="flex w-full items-center justify-center">
          <UserButton appearance={userButtonAppearance} />
        </div>
      </Show>
    </div>
  );
}

/* ---------------------------------- Navbar --------------------------------- */

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const closeTimerRef = useRef<number | undefined>(undefined);

  const closeMenu = () => setOpen(false);

  const openTools = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = undefined;
    setToolsOpen(true);
  };

  /** Graceful close — lets the cursor travel from the trigger to the panel. */
  const scheduleCloseTools = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setToolsOpen(false), 200);
  };

  const closeToolsNow = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = undefined;
    setToolsOpen(false);
  };

  /** Toggle from a click — must cancel any pending close timer first. */
  const toggleTools = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
    setToolsOpen((v) => !v);
  };

  const closeAll = () => {
    closeMenu();
    closeToolsNow();
  };

  // Close the mega menu with the Escape key.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeToolsNow();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Clear any pending close timer on unmount.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand onNavigate={closeAll} />

        <NavLinks
          variant="desktop"
          onNavigate={closeAll}
          toolsOpen={toolsOpen}
          onToolsToggle={toggleTools}
          onToolsMouseEnter={openTools}
          onToolsMouseLeave={scheduleCloseTools}
        />

        <div className="flex items-center gap-2">
          <AuthActions variant="desktop" />

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 sm:hidden"
          >
            {open ? (
              <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
            ) : (
              <HugeiconsIcon icon={Menu01Icon} className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Tools mega menu */}
      <div
        onMouseEnter={openTools}
        onMouseLeave={scheduleCloseTools}
        id="tools-mega-menu"
        aria-hidden={!toolsOpen}
        className={cn(
          "absolute inset-x-0 top-full hidden transition-all duration-200 ease-out sm:block",
          toolsOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        )}
      >
        <ToolsMegaMenu onNavigate={closeAll} />
      </div>

      {/* Mobile nav menu */}
      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white/95 px-5 py-4 sm:hidden">
          <NavLinks variant="mobile" onNavigate={closeMenu} />
          <AuthActions variant="mobile" />
        </div>
      )}
    </header>
  );
}
