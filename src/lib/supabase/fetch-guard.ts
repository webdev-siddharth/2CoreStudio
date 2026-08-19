export const FETCH_TIMEOUT_MS = 4000;

/**
 * True while the env keys are still the defaults from .env.local.example
 * (or missing). When unconfigured, pages skip Supabase entirely and render
 * instantly instead of waiting ~7s for a connection timeout.
 */
export function isUnconfiguredSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    !url ||
    !key ||
    url.includes("your-project") ||
    key.includes("your-anon") ||
    key === "your-anon-key"
  );
}

/**
 * Rejects (and lets the caller's catch fall back) if the Supabase request
 * takes longer than `ms`. A misconfigured or unreachable DB must never
 * hold a page hostage.
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number = FETCH_TIMEOUT_MS
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Supabase request timed out after ${ms}ms`)),
          ms
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}