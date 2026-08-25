import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_DOCS,
  LEGAL_HUB_DESCRIPTION,
  LEGAL_LAST_UPDATED,
  LEGAL_VERSION,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "2coreStudio legal hub — privacy policy, terms of service and cookie policy, kept current and versioned.",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          2coreStudio
        </p>
        <h1 className="display mt-3 text-4xl text-text sm:text-5xl">
          LEGAL <span className="text-primary">/</span> THE FINE PRINT
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
          {LEGAL_HUB_DESCRIPTION}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="nb-tag nb-tag--a">Updated {LEGAL_LAST_UPDATED}</span>
          <span className="nb-tag nb-tag--b">Version {LEGAL_VERSION}</span>
        </div>
      </Reveal>

      <section aria-label="Legal documents" className="mt-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {LEGAL_DOCS.map((doc, i) => (
            <Reveal key={doc.slug} delay={i * 80}>
              <Link
                href={doc.href}
                className="nb-card nb-card--lift group block h-full no-underline"
              >
                <span className="nb-status nb-status--published">
                  {doc.changelog[0].version}
                </span>
                <h2 className="display mt-4 text-lg text-text group-hover:text-primary">
                  {doc.title}
                </h2>
                <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                  {doc.description}
                </p>
                <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  Updated {doc.changelog[0].date} → read
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label="Document changelog" className="mt-14">
        <Reveal>
          <div className="nb-card max-w-3xl">
            <span className="nb-tag nb-tag--a absolute -top-3 -left-3">
              Changelog
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              What changed
            </p>
            <h2 className="display mt-3 text-2xl text-text">
              Version history
            </h2>
            <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
              Every legal document carries its own changelog. This page lists
              each document with the date it was last updated so you always
              know you are reading the current version.
            </p>
            <ul className="mt-5 space-y-2 font-mono text-sm text-text">
              {LEGAL_DOCS.map((doc) => (
                <li key={doc.slug} className="flex flex-wrap items-baseline gap-x-3">
                  <Link
                    href={doc.href}
                    className="font-bold uppercase tracking-wider no-underline hover:text-primary"
                  >
                    {doc.title}
                  </Link>
                  <span className="text-muted">
                    v{doc.changelog[0].version} · {doc.changelog[0].date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section aria-label="Contact for legal queries" className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Questions &amp; requests
          </p>
          <h2 className="display mt-3 text-3xl text-text">
            Contact for legal queries
          </h2>
          <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-text">
            For questions about privacy, data, cookies or these documents, email
            us.
          </p>
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="nb-btn nb-btn--secondary mt-5 inline-block"
          >
            {LEGAL_CONTACT_EMAIL} →
          </a>
        </section>
      </Reveal>
    </div>
  );
}