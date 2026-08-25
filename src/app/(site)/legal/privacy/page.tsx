import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalDoc,
  LegalList,
  LegalP,
  LegalSection,
  LegalSub,
} from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What data 2coreStudio collects, how it is used, how long it is kept and how you can request deletion.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      slug="privacy"
      summary={
        <>
          <p>
            The short version: we only collect what is needed to run the
            service — account details if you sign up, and basic download and
            view activity to keep the catalog healthy. We do not sell your
            data, we do not run ads, and you can ask us to delete your data at
            any time by emailing support@2corestudio.com.
          </p>
          <p className="mt-2">
            The full document below explains exactly what we collect, why, how
            long we keep it, and the rights you have.
          </p>
        </>
      }
    >
      <LegalSection title="Who we are" />
      <LegalP>
        This Privacy Policy explains how 2coreStudio (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses and protects your data when you use our website and
        download or run our software. Where a formal legal entity is required,
        insert the registered name and address here before launch.
      </LegalP>

      <LegalSection title="What we collect" />
      <LegalP>
        We collect the minimum needed to run the service. Nothing we collect is
        sold, rented or shared with advertisers.
      </LegalP>
      <LegalSub>Account data</LegalSub>
      <LegalP>
        When you create an account we store your email address and a securely
        hashed password through our authentication provider (Supabase Auth). We
        never see or store your password in plain text. You can also sign in
        with a magic link, which verifies ownership of your email without a
        password.
      </LegalP>
      <LegalSub>Profile data</LegalSub>
      <LegalP>
        If you choose to, you can add a username and display name to your
        profile. Your account tier (for example, whether you have purchased a
        premium unlock) is stored so we can grant access correctly.
      </LegalP>
      <LegalSub>Activity data</LegalSub>
      <LegalP>
        When you view an app page or download an app we log a lightweight
        event: which app it was, which platform you are on, and — only if you
        are signed in — your user id. This powers download counts and helps us
        understand which apps to build next.
      </LegalP>
      <LegalSub>Storage on your device</LegalSub>
      <LegalP>
        We use a small amount of browser storage so the site works as you
        expect:
      </LegalP>
      <LegalList
        items={[
          <>
            your light or dark theme preference (localStorage key{" "}
            <code className="text-primary">2core-theme</code>),
          </>,
          <>
            a session-only marker that stops a page view being double-counted
            (sessionStorage key <code className="text-primary">2core-viewed-…</code>
            ).
          </>,
        ]}
      />

      <LegalSection title="How we use your data" />
      <LegalList
        items={[
          <>To run the website and deliver downloads to you,</>,
          <>To keep you signed in across pages,</>,
          <>To remember your theme and account preferences,</>,
          <>To show download activity and improve the catalog,</>,
          <>
            To keep the service secure and prevent abuse (for example,
            spam accounts or fraudulent downloads), and
          </>,
          <>To comply with legal obligations.</>,
        ]}
      />

      <LegalSection title="Cookies and similar technologies" />
      <LegalP>
        We set only the cookies required for signing in and a few preferences.
        We do not use advertising or cross-site tracking cookies. For the full
        list of cookies and storage we use, and how to control them, see our{" "}
        <Link
          href="/legal/cookies"
          className="font-bold text-primary no-underline hover:text-secondary"
        >
          Cookie Policy
        </Link>
        .
      </LegalP>

      <LegalSection title="How long we keep your data" />
      <LegalP>
        Account data is kept for as long as your account is active. Activity
        events are kept to maintain download counts and improve the catalog;
        they are retained in aggregate and trimmed over time. When you ask us
        to delete your data we remove personal records and anonymise any
        remaining analytics.
      </LegalP>

      <LegalSection title="Your rights and deletion" />
      <LegalP>
        You may request access to, a copy of, correction of, or deletion of
        your personal data at any time by emailing support@2corestudio.com. We
        respond to verified requests within 30 days. Where regional law grants
        you additional rights (for example under the GDPR or the CCPA), we
        honour those rights for everyone who uses the service.
      </LegalP>

      <LegalSection title="Where your data is stored" />
      <LegalP>
        Data is hosted by our infrastructure providers: Supabase (Postgres and
        Auth) and the Cloudflare edge network which serves this site. As with
        any hosted service, server and edge logs may briefly contain basic
        technical information such as IP address, user agent and request
        times, which are used for security and availability. Review and confirm
        the exact hosting regions with your providers before launch.
      </LegalP>

      <LegalSection title="Children&apos;s privacy" />
      <LegalP>
        The service is not directed at children. If you believe a child under
        the age of 13 has provided us personal data, contact us and we will
        delete it promptly.
      </LegalP>

      <LegalSection title="Changes to this policy" />
      <LegalP>
        We update this policy when the service or the law changes. The current
        version and a plain-English changelog of every update are listed in the
        version history at the bottom of this page — we do not just change the
        date.
      </LegalP>
    </LegalDoc>
  );
}