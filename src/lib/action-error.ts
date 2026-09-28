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
