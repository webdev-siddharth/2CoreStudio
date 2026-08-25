import type { ReactNode } from "react";
import Link from "next/link";
import {
  GitHubIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@/components/SocialIcons";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/2corestudio", Icon: InstagramIcon },
  { label: "GitHub", href: "https://github.com/2corestudio", Icon: GitHubIcon },
  { label: "Twitter", href: "https://twitter.com/2corestudio", Icon: TwitterIcon },
  { label: "YouTube", href: "https://youtube.com/@2corestudio", Icon: YouTubeIcon },
];

const QUICK_LINKS = [
  { label: "All Apps", href: "/apps" },
  { label: "News / Blog", href: "/news" },
  { label: "About", href: "/about" },
];

const ADMIN_LINKS = [
  { label: "Admin console", href: "/admin" },
  { label: "Create apps", href: "/admin/apps/new" },
  { label: "Create news/blog", href: "/admin/posts" },
];

const LEGAL_LINKS = [
  { label: "Legal", href: "/legal" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Security", href: "/support/security" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

function ColumnHeading({ children }: { children: string }) {
  return (
    <p className="font-mono text-[0.62rem] font-bold uppercase tracking-widest text-muted">
      {children}
    </p>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary"
    >
      {children}
    </Link>
  );
}

export function Footer({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <footer className="mt-auto border-t-[3px] border-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap lg:items-start lg:justify-between">
        <div className="flex flex-col items-start gap-3">
          <Link href="/" className="logo text-lg text-text no-underline">
            2CORE<span className="text-primary">STUDIO</span>
          </Link>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-text">
            Connect with us
          </p>
          <div className="flex items-center gap-3">
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
        </div>

        <div className="flex flex-col gap-3">
          <ColumnHeading>Quick Links</ColumnHeading>
          <nav
            aria-label="Quick links"
            className="flex flex-col items-start gap-2"
          >
            {QUICK_LINKS.map(({ label, href }) => (
              <FooterLink key={label} href={href}>
                {label}
              </FooterLink>
            ))}
          </nav>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-3">
            <ColumnHeading>Admin</ColumnHeading>
            <nav
              aria-label="Admin"
              className="flex flex-col items-start gap-2"
            >
              {ADMIN_LINKS.map(({ label, href }) => (
                <FooterLink key={label} href={href}>
                  {label}
                </FooterLink>
              ))}
            </nav>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <ColumnHeading>Help Desk</ColumnHeading>
          <div className="flex flex-col items-start gap-2">
            <FooterLink href="/support">Support</FooterLink>
            <p className="mt-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-muted">
              Direct contact
            </p>
            <Link
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary"
            >
              {LEGAL_CONTACT_EMAIL}
            </Link>
            <p className="font-mono text-[0.68rem] leading-relaxed text-muted">
              Worldwide · digital downloads
            </p>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-[0.65rem] uppercase tracking-wider text-muted">
            © {new Date().getFullYear()} 2coreStudio. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          >
            {LEGAL_LINKS.map(({ label, href }) => (
              <FooterLink key={label} href={href}>
                {label}
              </FooterLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}