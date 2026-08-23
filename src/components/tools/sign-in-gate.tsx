"use client";

import type { ReactNode } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Action button shown to signed-out visitors on tools that require an
 * account. Opens the Clerk sign-in modal in place (no redirect), so the
 * visitor stays on the tool page after authenticating.
 */
export function SignInGateButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <SignInButton mode="modal">
      <Button type="button" className={className}>
        {children ?? "Sign in to run"}
      </Button>
    </SignInButton>
  );
}
