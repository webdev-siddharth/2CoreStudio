import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t-[3px] border-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
        <Link href="/" className="logo text-sm text-ink no-underline">
          2CORE<span className="text-magenta">STUDIO</span>
        </Link>
        <p className="text-[0.65rem] uppercase tracking-wider text-muted">
          © {new Date().getFullYear()} 2coreStudio
        </p>
        <nav className="flex gap-4">
          <Link
            href="/apps"
            className="py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
          >
            All Apps
          </Link>
          <Link
            href="/profile"
            className="py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
          >
            Profile
          </Link>
        </nav>
        <Link href="/apps" className="nb-btn nb-btn--secondary no-underline">
          Browse software →
        </Link>
      </div>
    </footer>
  );
}
