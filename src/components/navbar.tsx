"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/config/navigation";

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
};

function NavLinks({ variant, onNavigate }: NavLinksProps) {
  const isDesktop = variant === "desktop";

  return (
    <nav className={isDesktop ? "hidden items-center gap-1 sm:flex" : "flex flex-col gap-1"}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={
            isDesktop
              ? "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
              : "rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
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
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand onNavigate={closeMenu} />

        <NavLinks variant="desktop" />

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

      {/* Mobile nav menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white/95 px-5 py-4 sm:hidden">
          <NavLinks variant="mobile" onNavigate={closeMenu} />
          <AuthActions variant="mobile" />
        </div>
      )}
    </header>
  );
}
