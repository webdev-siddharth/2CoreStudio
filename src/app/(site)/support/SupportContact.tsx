"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  GitHubIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@/components/SocialIcons";
import { CONTACT_EMAIL, SECURITY_EMAIL } from "./data";

const TOPICS = [
  "Purchase & billing",
  "Account & login",
  "Download & install",
  "Bug report",
  "Something else",
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/2corestudio", Icon: InstagramIcon },
  { label: "GitHub", href: "https://github.com/2corestudio", Icon: GitHubIcon },
  { label: "Twitter", href: "https://twitter.com/2corestudio", Icon: TwitterIcon },
  { label: "YouTube", href: "https://youtube.com/@2corestudio", Icon: YouTubeIcon },
];

export function SupportContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>((TOPICS[0] as string));
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const subject = encodeURIComponent(`[Support] ${topic}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="border-b-[3px] border-ink bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Escalation
          </p>
          <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
            Talk to a human
          </h2>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
            No bots, no ticket roulette. A human reads every message — usually
            same-day. Start with the cheapest option; escalate only if you need
            to.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Reveal delay={0}>
            <div className="nb-card flex h-full flex-col">
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                Step 1 · Fastest
              </p>
              <h3 className="display mt-2 text-base text-text">Email us</h3>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                Direct line to support. Attach screenshots, logs and error
                codes when you have them.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="nb-btn mt-4 self-start"
              >
                {CONTACT_EMAIL} →
              </a>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="nb-card flex h-full flex-col">
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                Step 2 · Quick questions
              </p>
              <h3 className="display mt-2 text-base text-text">Socials</h3>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                Comfortable in a DM? The team hangs out on all four — fastest
                for short questions.
              </p>
              <div className="mt-4 flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="text-muted no-underline transition-colors hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              <p className="mt-auto pt-4 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                @2corestudio everywhere
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="nb-card flex h-full flex-col">
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                Step 3 · Structured reports
              </p>
              <h3 className="display mt-2 text-base text-text">Ticket form</h3>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                Best for bug reports with logs. Filling this composes a
                ready-to-send email in your mail app — nothing leaves your
                device.
              </p>

              <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
                <div>
                  <label htmlFor="contact-name" className="field-label">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="nb-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="field-label">
                    Your email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="nb-input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="contact-topic" className="field-label">
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="nb-input w-full"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="field-label">
                    What&apos;s up?
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="OS, app version, error code if you have it…"
                    className="nb-input w-full resize-y"
                  />
                </div>
                <button type="submit" className="nb-btn self-start">
                  Compose email →
                </button>
              </form>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <div className="nb-card mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs leading-relaxed text-muted">
              Found a <span className="font-bold text-text">security</span>{" "}
              issue? Skip the queue — responsible disclosure goes straight to{" "}
              <a
                href={`mailto:${SECURITY_EMAIL}`}
                className="font-bold text-primary no-underline hover:text-secondary"
              >
                {SECURITY_EMAIL}
              </a>
              .
            </p>
            <Link href="/support/security" className="nb-btn nb-btn--secondary shrink-0">
              Security page →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}