import type { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with 2coreStudio software — downloads, accounts and troubleshooting.",
};

export default function SupportPage() {
  return (
    <UnderConstruction
      title="SUPPORT"
      subtitle="Help when you need it"
      blurb="A support hub with FAQs, download guides and contact channels is under construction. For immediate help, reach out through the profile account page."
    />
  );
}
