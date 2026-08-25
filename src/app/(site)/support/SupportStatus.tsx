import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export type InfraStatus = "operational" | "degraded" | "unconfigured";

const STATUS_META: Record<
  InfraStatus,
  { label: string; className: string; note: string }
> = {
  operational: {
    label: "All systems operational",
    className: "nb-status--published",
    note: "Every live component reports healthy right now.",
  },
  degraded: {
    label: "Some services degraded",
    className: "nb-status--unpublished",
    note: "Core services are having trouble reaching the database. Updates land on the News timeline as they come in.",
  },
  unconfigured: {
    label: "Monitoring offline",
    className: "",
    note: "Live checks need the database configured. Until then this status stays on standby.",
  },
};

const COMPONENTS: {
  id: string;
  name: string;
  desc: string;
  kind: "live" | "manual";
}[] = [
  {
    id: "api-auth",
    name: "API & auth",
    desc: "Sign-ins, accounts, downloads and purchases.",
    kind: "live",
  },
  {
    id: "catalog",
    name: "App catalog",
    desc: "Store, versions and changelogs — shares core infrastructure with API & auth.",
    kind: "live",
  },
  {
    id: "website",
    name: "Website & pages",
    desc: "This site. If this page rendered, it just reported itself healthy.",
    kind: "live",
  },
  {
    id: "community",
    name: "Community & socials",
    desc: "External platforms — checked by hand, not by probe.",
    kind: "manual",
  },
];

export function SupportStatus({ status }: { status: InfraStatus }) {
  const meta = STATUS_META[status];
  const liveChip = status === "operational" ? "nb-status--published" : "nb-status--unpublished";

  return (
    <section id="status" className="border-b-[3px] border-ink bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Transparency
          </p>
          <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
            System status
          </h2>
        </Reveal>

        <Reveal delay={60}>
          <div className="nb-card mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="display text-lg text-text">{meta.label}</p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                {meta.note}
              </p>
            </div>
            <span className={`nb-status shrink-0 self-start sm:self-auto ${meta.className}`}>
              {status === "operational"
                ? "Operational"
                : status === "degraded"
                  ? "Degraded"
                  : "Standby"}
            </span>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {COMPONENTS.map((component, i) => (
            <Reveal key={component.id} delay={Math.min(i * 60, 180)}>
              <div className="nb-card flex h-full items-start justify-between gap-4">
                <div>
                  <h3 className="display text-sm text-text">{component.name}</h3>
                  <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">
                    {component.desc}
                  </p>
                </div>
                <span
                  className={`nb-status shrink-0 ${
                    component.kind === "manual"
                      ? "nb-status--draft"
                      : liveChip
                  }`}
                >
                  {component.kind === "manual" ? "Manual" : status === "unconfigured" ? "Standby" : status === "operational" ? "Operational" : "Degraded"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Reveal delay={60}>
            <div className="nb-card h-full">
              <h3 className="display text-sm text-text">Live incident updates</h3>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">
                During an incident we post short, timestamped updates in
                sequence on the News timeline — what is affected, what we are
                doing, when it is resolved. Brief updates every half hour beat
                silence followed by an explanation.
              </p>
              <Link
                href="/news"
                className="mt-3 inline-block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-primary no-underline hover:text-secondary"
              >
                Watch the timeline →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="nb-card h-full">
              <h3 className="display text-sm text-text">Scheduled maintenance</h3>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">
                Planned work is announced at least 72 hours in advance on the
                News timeline, with the expected duration and affected
                components. Surprise maintenance is a failure on our part —
                report it if it happens.
              </p>
              <p className="mt-3 font-mono text-[0.62rem] leading-relaxed text-muted">
                Note: this section lives on the same infrastructure it reports
                on. If the site is fully down it cannot report; a standalone
                status page is on the roadmap.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}