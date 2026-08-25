import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function HomeCtaBand() {
  return (
    <section className="border-b-[3px] border-ink bg-surface">
      <div className="bg-[repeating-linear-gradient(45deg,var(--primary),var(--primary)_10px,var(--secondary)_10px,var(--secondary)_20px)] py-7">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="border-[3px] border-ink bg-bg px-6 py-12 text-center shadow-[8px_8px_0_var(--ink)] sm:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Start here
              </p>
              <h2 className="display mt-3 text-4xl text-text sm:text-5xl">
                The catalog is open
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-text">
                Web, Windows, Mac, Android, iOS, Linux — pick a platform, grab
                an app, start now.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/apps" className="nb-btn">
                  Browse all software →
                </Link>
                <Link href="/news" className="nb-btn nb-btn--secondary">
                  Read the news →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}