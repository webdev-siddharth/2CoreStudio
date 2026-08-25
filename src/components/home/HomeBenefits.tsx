import { Reveal } from "@/components/Reveal";

const BENEFITS = [
  {
    glyph: "◆",
    title: "One build, six platforms",
    body: "Ship once to web, Windows, Mac, Android, iOS and Linux — no separate ports to babysit.",
  },
  {
    glyph: "★",
    title: "Instant play, no account",
    body: "Download and run. No signup wall, no waiting for approval, no friction.",
  },
  {
    glyph: "■",
    title: "Free core catalog",
    body: "Every app is free to try. Premium unlocks extras only when you want them.",
  },
  {
    glyph: "▲",
    title: "Fresh drops weekly",
    body: "New software lands every week, with changelogs for every update.",
  },
];

export function HomeBenefits() {
  return (
    <section className="border-b-[3px] border-ink bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Why 2corestudio
          </p>
          <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
            Built for every platform. Built for you.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 80}>
              <div className="nb-card flex h-full flex-col">
                <div className="mb-4 grid h-12 w-12 place-items-center border-[3px] border-ink bg-surface2 text-2xl text-primary shadow-[3px_3px_0_var(--ink)]">
                  {benefit.glyph}
                </div>
                <h3 className="display text-base text-text">{benefit.title}</h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                  {benefit.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}