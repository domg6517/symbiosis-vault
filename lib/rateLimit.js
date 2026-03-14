// Simple in-memory rate limiter for serverless functions
// Note: resets when the serverless function cold starts, but still prevents burst abuse

const rateLimitMap = new Map();

// Clean up old entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > 120000) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

/**
 * @param {string} identifier - IP or user ID
 * @param {number} maxRequests - max requests per window
 * @param {number} windowMs - time window in ms (default 60s)
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function rateLimit(identifier, maxRequests = 30, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * Get client IP from request headers (works on Vercel)
 */
export function getClientIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
