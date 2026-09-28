export function actionErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (/^Minified React error #\d+/.test(err.message)) {
      const digest = (err as Error & { digest?: string }).digest;
      return digest
        ? `Action failed. (ref ${String(digest)})`
        : "Action failed.";
    }
    return err.message;
  }
  return typeof err === "string" && err ? err : "Action failed.";
}

export function redirectDestination(err: unknown): string | null {
  if (!(err instanceof Error)) return null;
  const digest = (err as Error & { digest?: unknown }).digest;
  if (typeof digest !== "string") return null;
  if (!digest.startsWith("NEXT_REDIRECT;")) return null;
  const parts = digest.split(";");
  const destination = parts.slice(2, -2).join(";");
  return destination || null;
}
