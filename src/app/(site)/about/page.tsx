import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  AndroidIcon,
  AppleIcon,
  GlobeIcon,
  PhoneIcon,
  TuxIcon,
  WinIcon,
} from "@/components/PlatformIcons";

export const metadata: Metadata = {
  title: "About",
  description:
    "2coreStudio is an independent studio building fast, cross-platform software for web, Windows, Mac, Android, iOS and Linux — no accounts, no paywalls.",
};

const VALUES = [
  {
    glyph: "◆",
    title: "One build, six platforms",
    body: "Ship once to web, Windows, Mac, Android, iOS and Linux — no separate ports to babysit.",
  },
  {
    glyph: "★",
    title: "Speed by default",
    body: "Fast software is respectful software. We sweat the milliseconds so you don't have to.",
  },
  {
    glyph: "■",
    title: "No friction, no accounts",
    body: "Download and run. No signup wall, no waiting for approval, no dark patterns.",
  },
  {
    glyph: "▲",
    title: "Free core catalog",
    body: "Every app is free to try. Premium unlocks extras only when you want them.",
  },
];

const PLATFORMS = [
  { name: "WEB", Icon: GlobeIcon },
  { name: "WINDOWS", Icon: WinIcon },
  { name: "MAC", Icon: AppleIcon },
  { name: "ANDROID", Icon: AndroidIcon },
  { name: "IOS", Icon: PhoneIcon },
  { name: "LINUX", Icon: TuxIcon },
];

const STATS = [
  { value: "500+", label: "Downloads served" },
  { value: "6", label: "Platforms, one build" },
  { value: "5+", label: "Apps in the catalog" },
];

const MILESTONES = [
  {
    label: "Day one",
    title: "Two cores, one mission",
    body: "2coreStudio starts with a simple frustration: good software locked to one platform.",
  },
  {
    label: "First drops",
    title: "Every platform at once",
    body: "The first apps ship to all six platforms the same day — no ports, no delays.",
  },
  {
    label: "Now",
    title: "Weekly drops, living catalog",
    body: "Fresh software lands every week, with public changelogs for every update.",
  },
];

const TEAM = [
  {
    initials: "2C",
    name: "Founder",
    role: "Lead builder",
    tint: "bg-primary",
  },
  {
    initials: "??",
    name: "Roster",
    role: "Expanding soon",
    tint: "bg-secondary",
  },
];

function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        {kicker}
      </p>
      <h2 className="display mt-3 text-3xl text-text sm:text-4xl">{title}</h2>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          2coreStudio
        </p>
        <h1 className="display mt-3 text-4xl text-text sm:text-5xl">
          ABOUT <span className="text-primary">/</span> THE STUDIO
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
          The studio behind the software — fast, cross-platform apps for web,
          Windows, Mac, Android, iOS and Linux, made by an independent team
          that ships with speed and soul.
        </p>
      </Reveal>

      {/* Origin story */}
      <section aria-label="Origin story" className="mt-10">
        <Reveal>
          <div className="nb-card relative max-w-3xl">
            <span className="nb-tag nb-tag--a absolute -top-3 -left-3">
              The story
            </span>
            <p className="display text-base text-text">
              Built because good software shouldn&apos;t be locked to one
              platform
            </p>
            <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
              2coreStudio started from a simple frustration: great tools that
              only run on one device, one operating system, one walled garden.
              A Mac user couldn&apos;t use an Android app. A Windows user was
              locked out of iOS tools. Nobody was building the same experience
              everywhere, in a way anyone could just download and run.
            </p>
            <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
              So we built it ourselves — one build that ships to all six
              platforms, with no account required and nothing hidden behind
              approval queues. Today the catalog keeps growing, every week,
              with every update logged in the open.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="nb-chip cursor-default">Independent</span>
              <span className="nb-chip cursor-default">No account</span>
              <span className="nb-chip cursor-default">6 platforms</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section aria-label="What we stand for" className="mt-14">
        <SectionHeading kicker="What we stand for" title="Values, not slogans" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 80}>
              <div className="nb-card flex h-full flex-col">
                <div className="mb-4 grid h-12 w-12 place-items-center border-[3px] border-ink bg-surface2 text-2xl text-primary shadow-[3px_3px_0_var(--ink)]">
                  {value.glyph}
                </div>
                <h3 className="display text-base text-text">{value.title}</h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section aria-label="Platforms we build" className="mt-14">
        <SectionHeading
          kicker="What we build"
          title="One build, six platforms"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PLATFORMS.map(({ name, Icon }, i) => (
            <Reveal key={name} delay={i * 60}>
              <div className="nb-card nb-card--lift group grid h-full place-items-center gap-3 py-6 text-center">
                <Icon
                  className={`h-10 w-10 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 ${
                    i % 2 === 0
                      ? "text-primary group-hover:text-secondary"
                      : "text-secondary group-hover:text-primary"
                  }`}
                />
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-text">
                  {name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <Link href="/apps" className="nb-btn mt-8">
            Browse all software →
          </Link>
        </Reveal>
      </section>

      {/* Milestones */}
      <section aria-label="Milestones" className="mt-14">
        <SectionHeading kicker="The journey" title="Milestones" />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {MILESTONES.map((milestone, i) => (
            <Reveal key={milestone.label} delay={i * 80}>
              <div className="nb-card flex h-full flex-col">
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  {milestone.label}
                </p>
                <h3 className="display mt-2 text-base text-text">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                  {milestone.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
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

      {/* Independence band */}
      <section
        aria-label="Independence"
        className="relative left-1/2 mt-14 w-[100vw] -translate-x-1/2"
      >
        <div className="bg-[repeating-linear-gradient(45deg,var(--primary),var(--primary)_10px,var(--secondary)_10px,var(--secondary)_20px)] py-7">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="border-[3px] border-ink bg-bg px-6 py-12 text-center shadow-[8px_8px_0_var(--ink)] sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  No shortcuts
                </p>
                <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
                  Proudly independent
                </h2>
                <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-text">
                  No investors to please, no subscription walls, no bloatware.
                  Software that stays free to try and earns its place by being
                  worth it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section aria-label="Team" className="mt-14">
        <SectionHeading kicker="The people" title="Team" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 80}>
              <div className="nb-card flex h-full flex-col">
                <div
                  className={`grid h-20 w-20 place-items-center border-[3px] border-ink text-3xl text-bg shadow-[4px_4px_0_var(--ink)] ${member.tint}`}
                >
                  {member.initials}
                </div>
                <h3 className="display mt-4 text-lg text-text">{member.name}</h3>
                <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                  {member.role}
                </p>
                <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
                  Photos and the full roster land here soon — the studio stays
                  small by design.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Get started" className="relative left-1/2 mt-14 w-[100vw] -translate-x-1/2">
        <div className="bg-[repeating-linear-gradient(45deg,var(--primary),var(--primary)_10px,var(--secondary)_10px,var(--secondary)_20px)] py-7">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="border-[3px] border-ink bg-surface px-6 py-12 text-center shadow-[8px_8px_0_var(--ink)] sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Start here
                </p>
                <h2 className="display mt-3 text-4xl text-text sm:text-5xl">
                  The catalog is open
                </h2>
                <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-text">
                  Web, Windows, Mac, Android, iOS, Linux — pick a platform,
                  grab an app, start now.
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
    </div>
  );
}