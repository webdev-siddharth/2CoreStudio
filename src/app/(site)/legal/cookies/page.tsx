import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  LegalDoc,
  LegalList,
  LegalP,
  LegalSection,
  LegalTable,
} from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies and site storage 2coreStudio uses, what they do and how you can control them.",
};

const COOKIE_ROWS: ReactNode[][] = [
  [
    <code key="auth" className="text-primary">
      sb-&lt;project&gt;-auth-token
    </code>,
    "Keeps you signed in across pages while your session is active.",
    "Required · authentication",
  ],
  [
    <code key="verifier" className="text-primary">
      sb-&lt;project&gt;-auth-token-code-verifier
    </code>,
    "Used briefly during email or magic-link sign-in to complete the secure handshake (PKCE).",
    "Required · functional",
  ],
  [
    <code key="theme" className="text-primary">
      2core-theme
    </code>,
    "Remembers your light or dark theme preference. Stored in your browser&apos;s local storage, not a cookie.",
    "Preference",
  ],
  [
    <code key="viewed" className="text-primary">
      2core-viewed-&lt;app&gt;
    </code>,
    "A temporary marker that stops a page view being counted twice in one visit. Cleared when you close the tab.",
    "Functional · session-only",
  ],
];

export default function CookiePage() {
  return (
    <LegalDoc
      slug="cookies"
      summary={
        <>
          <p>
            The short version: we only use cookies and storage to keep you
            signed in, complete sign-in, remember your theme and avoid
            double-counting a view. We don&apos;t use advertising or tracking
            cookies, and we never sell your data.
          </p>
          <p className="mt-2">
            The table below lists everything we store and how to control it.
          </p>
        </>
      }
    >
      <LegalSection title="What cookies and storage are" />
      <LegalP>
        Cookies are small text files a website places on your device. We also
        use browser storage that works like cookies but never leaves your
        device — it is not sent to us on every request the way cookie headers
        are. This policy covers both, because both are worth knowing about.
      </LegalP>

      <LegalSection title="What we use and why" />
      <LegalP>
        We keep the list deliberately short. There are no advertising cookies,
        no third-party analytics, and no cross-site tracking.
      </LegalP>
      <LegalTable
        head={["Name / storage", "What it does", "Type"]}
        rows={COOKIE_ROWS}
      />
      <LegalP>
        The exact authentication cookie name includes our project reference, so
        on your device it appears with a value in place of{" "}
        <code className="text-primary">&lt;project&gt;</code>.
      </LegalP>

      <LegalSection title="Third-party cookies" />
      <LegalP>
        We do not set or allow third-party advertising or tracking cookies on
        this site. Where a download is served through a third-party app store,
        that store may set its own cookies under its own privacy policy —
        check the store&apos;s policy for details.
      </LegalP>

      <LegalSection title="How to control cookies and storage" />
      <LegalList
        items={[
          <>
            <strong className="text-text">Sign out</strong> — signing out of
            your account clears the authentication cookie immediately.
          </>,
          <>
            <strong className="text-text">Browser settings</strong> — every
            major browser lets you view, block or delete cookies and site
            storage, either globally or per-site.
          </>,
          <>
            <strong className="text-text">Private or incognito mode</strong> —
            session cookies and session storage are cleared automatically when
            you close a private browsing window.
          </>,
        ]}
      />
      <LegalP>
        Blocking or removing the authentication cookie will sign you out.
        Blocking preference storage only means we can&apos;t remember your
        theme; the site still works.
      </LegalP>

      <LegalSection title="Changes to this policy" />
      <LegalP>
        If our cookie or storage usage changes, we update this page and record
        it in the version history below.
      </LegalP>
    </LegalDoc>
  );
}