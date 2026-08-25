import { Reveal } from "@/components/Reveal";

/**
 * STATS — hardcoded social proof strip. Edit these numbers here as the
 * catalog and download counts grow (keep them truthful).
 */
const STATS = [
  { value: "500+", label: "Downloads served" },
  { value: "6", label: "Platforms, one build" },
  { value: "5+", label: "Apps in the catalog" },
];

export function HomeStats() {
  return (
    <section
      aria-label="Studio statistics"
      className="border-b-[3px] border-ink bg-surface"
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80}>
            <div className="nb-card grid h-full place-items-center py-6 text-center">
              <p
                className={`display text-5xl ${
                  i % 2 === 0 ? "text-primary" : "text-secondary"
                }`}
              >
                {stat.value}
              </p>
              <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}