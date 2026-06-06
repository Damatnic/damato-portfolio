import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time string comparison for secrets (API keys, bearer tokens).
 * Returns false on any type/length mismatch without leaking timing. Use this
 * instead of `===` whenever an attacker-supplied value is checked against a
 * secret, so response time can't be used to recover the secret byte by byte.
 */
export function safeEqual(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
