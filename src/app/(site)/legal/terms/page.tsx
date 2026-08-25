import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalDoc,
  LegalList,
  LegalP,
  LegalSection,
} from "@/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement governing use of 2coreStudio products — user responsibilities, acceptable use and limitation of liability.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      slug="terms"
      summary={
        <>
          <p>
            The short version: our apps are free to try and provided
            &ldquo;as is&rdquo;. Use them lawfully, don&apos;t rip us off, and don&apos;t break
            other people&apos;s systems with them. If something goes wrong, our
            liability is limited to what you paid us — which usually means
            zero.
          </p>
          <p className="mt-2">
            The full agreement below sets out the details, including what
            happens if these terms change.
          </p>
        </>
      }
    >
      <LegalSection title="The agreement" />
      <LegalP>
        These Terms of Service (&ldquo;terms&rdquo;) govern your use of the
        2coreStudio website and any software we publish. By accessing the website or
        downloading, installing or running our software, you agree to these
        terms and to our{" "}
        <Link
          href="/legal/privacy"
          className="font-bold text-primary no-underline hover:text-secondary"
        >
          Privacy Policy
        </Link>
        . If you do not agree, please do not use the service.
      </LegalP>

      <LegalSection title="Accounts" />
      <LegalP>
        Some downloads require a free account. When you create one you are
        responsible for keeping your credentials secure and for the accuracy
        of the information you provide. You must not create accounts to
        circumvent a ban, restriction or abuse a promotion.
      </LegalP>

      <LegalSection title="Acceptable use" />
      <LegalP>You agree not to misuse the service. In particular you will not:</LegalP>
      <LegalList
        items={[
          <>attempt to reverse engineer, tamper with or bypass protections on our software, except as expressly permitted by law for interoperability,</>,
          <>redistribute, resell or sub-license our software or any part of it without our written permission,</>,
          <>use the service to probe, scan, attack or otherwise disrupt our infrastructure or third parties,</>,
          <>submit false requests, harvest other users&apos; data, or interfere with anyone else&apos;s use of the service,</>,
          <>use the service for any unlawful purpose or in violation of applicable law.</>,
        ]}
      />

      <LegalSection title="Software is provided &ldquo;as is&rdquo;" />
      <LegalP>
        Our software and website are provided &ldquo;as is&rdquo; and
        &ldquo;as available&rdquo; without warranties of any kind, express or implied, including
        merchantability, fitness for a particular purpose and
        non-infringement. We make no guarantee that downloads will always be
        available or that the software will be uninterrupted or error-free.
      </LegalP>

      <LegalSection title="Downloads and third-party platforms" />
      <LegalP>
        Apps are served through our website or distributed through third-party
        app stores. Where you download through a store, that store&apos;s own
        terms and agreements additionally apply. Paid features are generally
        unlocked through these stores, so refunds are handled by the store you
        purchased through.
      </LegalP>

      <LegalSection title="Intellectual property" />
      <LegalP>
        2coreStudio and our licensors own all rights in the website, the
        software, our branding and the content we publish. Your use of the
        service grants you no ownership. You may not use our name, marks or
        logos without our permission.
      </LegalP>

      <LegalSection title="Limitation of liability" />
      <LegalP>
        To the maximum extent permitted by law, 2coreStudio and its team will
        not be liable for any indirect, incidental, special or consequential
        damages, or for any loss of data, profits or business, arising from
        your use of the service. Our total liability in connection with the
        service is limited to the amount you paid us during the 12 months
        before the claim — which is typically nothing, because the core
        catalog is free.
      </LegalP>

      <LegalSection title="Termination" />
      <LegalP>
        You may stop using the service at any time and delete your account.
        We may suspend or terminate access for accounts that breach these
        terms, pose a risk to the service or its users, or are unlawful.
      </LegalP>

      <LegalSection title="Changes to these terms" />
      <LegalP>
        We update these terms from time to time. Material changes are noted in
        the version history at the bottom of this page. Your continued use of
        the service after an update means you accept the updated terms.
      </LegalP>

      <LegalSection title="Governing law" />
      <LegalP>
        These terms are governed by the laws of the jurisdiction in which
        2coreStudio is registered, without regard to conflict-of-law rules.
        Confirm and insert your governing jurisdiction and venue before launch.
        [Placeholder: governing jurisdiction]
      </LegalP>

      <LegalSection title="Contact" />
      <LegalP>
        Questions about these terms should be sent to support@2corestudio.com.
      </LegalP>
    </LegalDoc>
  );
}