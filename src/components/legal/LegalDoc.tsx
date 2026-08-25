import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_DOCS,
  type ChangelogEntry,
} from "@/lib/legal";

function latestEntry(changelog: ChangelogEntry[]): ChangelogEntry {
  return changelog[0];
}

export function LegalSection(
  { title }: { title: string },
) {
  return <h2 className="display mt-12 text-2xl text-text">{title}</h2>;
}

export function LegalSub({ children }: { children: ReactNode }) {
  return <h3 className="display mt-6 text-base text-primary">{children}</h3>;
}

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-text">
      {children}
    </p>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 font-mono text-sm leading-relaxed text-text marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalTable({ head, rows }: {
  head: ReactNode[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mt-4 max-w-3xl overflow-x-auto border-[3px] border-ink bg-surface shadow-[5px_5px_0_var(--ink)]">
      <table className="w-full border-collapse text-left font-mono text-xs">
        <thead>
          <tr className="bg-surface2">
            {head.map((cell, i) => (
              <th
                key={i}
                className="border-b-[3px] border-ink px-3 py-2 text-[0.62rem] uppercase tracking-widest text-muted"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-ink/20 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top text-text">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalDoc({
  slug,
  summary,
  children,
}: {
  slug: "privacy" | "terms" | "cookies";
  summary?: ReactNode;
  children: ReactNode;
}) {
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  if (!doc) return null;
  const current = latestEntry(doc.changelog);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          <Link href="/legal" className="no-underline hover:text-primary">
            Legal
          </Link>
          {" / "}
          {doc.kicker}
        </p>
        <h1 className="display mt-3 text-4xl text-text sm:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
          {doc.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="nb-tag nb-tag--a">Updated {current.date}</span>
          <span className="nb-tag nb-tag--b">Version {current.version}</span>
        </div>
      </Reveal>

      {summary && (
        <Reveal delay={60}>
          <div className="nb-card relative mt-10 max-w-3xl">
            <span className="nb-tag nb-tag--b absolute -top-3 -left-3">
              The short version
            </span>
            <div className="text-sm leading-relaxed text-text">{summary}</div>
          </div>
        </Reveal>
      )}

      <div className="mt-4">{children}</div>

      {/* Version history — checklist: keeps users trusting the most current copy */}
      <Reveal>
        <section aria-label="Version history" className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            What changed
          </p>
          <h2 className="display mt-3 text-3xl text-text">Version history</h2>
          <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-muted">
            A short changelog of every published version of this document. When
            we update a policy we add a plain-English summary here, not just a
            new date.
          </p>
          <ol className="mt-5 max-w-3xl space-y-3">
            {doc.changelog.map((entry) => (
              <li key={entry.version} className="nb-card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="nb-tag nb-tag--a">v{entry.version}</span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                    {entry.date}
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm leading-relaxed text-text">
                  {entry.summary}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* Contact — checklist: dedicated channel for legal / privacy enquiries */}
      <Reveal>
        <section aria-label="Contact for legal queries" className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Questions &amp; requests
          </p>
          <h2 className="display mt-3 text-3xl text-text">
            Contact for legal queries
          </h2>
          <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-text">
            For questions about privacy, data, cookies or these legal terms —
            or to request access to, correction of, or deletion of your data —
            email us. We aim to respond within 30 days.
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