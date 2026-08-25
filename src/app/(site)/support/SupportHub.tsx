"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AndroidIcon,
  AppleIcon,
  GlobeIcon,
  PhoneIcon,
  TuxIcon,
  WinIcon,
} from "@/components/PlatformIcons";
import { Reveal } from "@/components/Reveal";
import {
  SECTION_LABELS,
  SECTION_ORDER,
  SUPPORT_TOPICS,
  type PlatformKey,
  type SupportTopic,
} from "./data";

const ALL = "all";

const PLATFORM_TABS: {
  key: PlatformKey;
  label: string;
  Icon: (props: { className?: string }) => React.ReactNode;
}[] = [
  { key: "web", label: "WEB", Icon: GlobeIcon },
  { key: "windows", label: "WIN", Icon: WinIcon },
  { key: "macos", label: "MAC", Icon: AppleIcon },
  { key: "android", label: "AND", Icon: AndroidIcon },
  { key: "ios", label: "IOS", Icon: PhoneIcon },
  { key: "linux", label: "LIN", Icon: TuxIcon },
];

function matchesQuery(topic: SupportTopic, q: string): boolean {
  if (!q) return true;
  const haystack = [
    topic.title,
    topic.blurb,
    ...topic.bullets,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function SupportHub() {
  const [platform, setPlatform] = useState<PlatformKey | typeof ALL>(ALL);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      SUPPORT_TOPICS.filter(
        (topic) =>
          (platform === ALL ||
            topic.platforms.length === 0 ||
            topic.platforms.includes(platform)) &&
          matchesQuery(topic, query.trim().toLowerCase())
      ),
    [platform, query]
  );

  const hasActiveFilters = platform !== ALL || query.trim() !== "";

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH SUPPORT…"
          aria-label="Search support topics"
          className="nb-input min-w-[220px] flex-1 sm:max-w-md"
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setPlatform(ALL);
              setQuery("");
            }}
            className="nb-chip"
          >
            Clear filters ✕
          </button>
        )}
        <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-wider text-muted">
          {filtered.length} {filtered.length === 1 ? "topic" : "topics"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setPlatform(ALL)}
          className={`nb-chip ${platform === ALL ? "nb-chip--on" : ""}`}
          aria-pressed={platform === ALL}
        >
          All
        </button>
        {PLATFORM_TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPlatform(key)}
            className={`nb-chip inline-flex items-center gap-2 ${
              platform === key ? "nb-chip--on" : ""
            }`}
            aria-pressed={platform === key}
            title={`Show topics for ${label}`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[0.62rem]">{label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="nb-card mt-8 py-16 text-center">
          <p className="display text-lg text-text">NOTHING FOUND</p>
          <p className="mt-3 font-mono text-xs text-muted">
            No topics match the current search and platform. Try widening
            either — or jump straight to contact.
          </p>
          <a href="#contact" className="nb-btn mt-6">
            Ask a human →
          </a>
        </div>
      ) : (
        SECTION_ORDER.map((section) => {
          const topics = filtered.filter((t) => t.section === section);
          if (topics.length === 0) return null;
          const label = SECTION_LABELS[section];
          return (
            <section
              key={section}
              aria-label={label.title}
              className="mt-10"
            >
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  {label.kicker}
                </p>
                <h2 className="display mt-2 text-2xl text-text">
                  {label.title}
                </h2>
              </Reveal>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, i) => (
                  <Reveal key={topic.id} delay={Math.min(i * 60, 180)}>
                    <article className="nb-card flex h-full flex-col">
                      <h3 className="display text-base text-text">{topic.title}</h3>
                      <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                        {topic.blurb}
                      </p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {topic.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-2 text-[0.72rem] leading-relaxed text-text"
                          >
                            <span aria-hidden className="text-primary">
                              →
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-4">
                        {topic.links && topic.links.length > 0 && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {topic.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-primary no-underline hover:text-secondary"
                              >
                                {link.label} →
                              </Link>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                          ↻ Reviewed {topic.lastReviewed}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}