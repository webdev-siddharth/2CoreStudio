import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60svh] items-center justify-center px-6 py-20">
      <div className="nb-card max-w-md text-center">
        <p className="display text-6xl text-text">
          4<span className="text-primary">0</span>
          <span className="text-secondary">4</span>
        </p>
        <h1 className="display mt-4 text-xl text-text">PAGE NOT FOUND</h1>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
          The page you&apos;re after was deleted, unpublished, or never existed.
        </p>
        <Link href="/apps" className="nb-btn mt-6">
          Browse software →
        </Link>
      </div>
    </section>
  );
}
