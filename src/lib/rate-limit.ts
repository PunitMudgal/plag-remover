/**
 * Minimal in-memory sliding-window rate limiter. Sufficient for a single
 * server instance — swap for Redis/Upstash if the app ever scales out.
 */
const buckets = new Map<string, number[]>();

/** Returns true when the request is within the limit, false when it exceeds it. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);

  // Occasional pruning so stale keys can't accumulate unbounded.
  if (buckets.size > 10_000) {
    for (const [k, timestamps] of buckets) {
      if (timestamps.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

/** Best-effort client IP for rate-limit keys (first hop of x-forwarded-for). */
export function clientIp(request: Request): string {
  return (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
}
