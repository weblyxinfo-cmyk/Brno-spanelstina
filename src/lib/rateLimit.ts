/**
 * Simple in-memory rate limiter for serverless environments
 * Limits requests per IP address
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
// Note: In serverless, this resets on cold start. For production,
// consider using Redis or a database-backed solution.
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Check if a request from an IP is allowed
 * @param ip - The IP address to check
 * @returns Object with allowed status and optional retry time
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // Clean up expired entries periodically (simple cleanup)
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }

  // No existing entry or expired entry
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000); // seconds
    return { allowed: false, retryAfter };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return { allowed: true };
}

/**
 * Get remaining requests for an IP
 * @param ip - The IP address to check
 * @returns Number of remaining requests in the current window
 */
export function getRemainingRequests(ip: string): number {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    return MAX_REQUESTS_PER_WINDOW;
  }

  return Math.max(0, MAX_REQUESTS_PER_WINDOW - entry.count);
}
