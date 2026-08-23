/**
 * Clerk billing plan descriptors used for feature gating. Slugs come from the
 * Clerk dashboard (verified against the live instance):
 *   Free → "free_user", Pro → "pro", Creator → "creator"
 * Both paid tiers include document uploads, so gating checks membership in
 * all of PAID_PLANS.
 */
export const PRO_PLAN = "user:pro" as const;
export const CREATOR_PLAN = "user:creator" as const;
export const PAID_PLANS = [PRO_PLAN, CREATOR_PLAN] as const;

/** Minimal shape of Clerk's `has()` authorization helper (server and client). */
type HasPlanCheck = (params: { plan: string }) => boolean;

/** True when the user is on any paid plan (Pro or Creator). */
export function hasPaidPlan(has: HasPlanCheck): boolean {
  return PAID_PLANS.some((plan) => has({ plan }));
}
