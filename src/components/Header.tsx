"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SearchNav } from "@/components/SearchNav";
import { AccountMenu } from "@/components/AccountMenu";

const NAV_LINKS = [
  { label: "APPS", href: "/apps", match: "/apps" },
  { label: "NEWS / BLOG", href: "/news", match: "/news" },
  { label: "ABOUT", href: "/about", match: "/about" },
  { label: "SUPPORT", href: "/support", match: "/support" },
];

export function Header({
  user,
  isAdmin,
}: {
  user: { id: string; email: string } | null;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b-[3px] border-ink px-5 py-4">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link
          href="/"
          className="logo justify-self-start text-[1.4rem] leading-none text-ink no-underline"
          onClick={() => setMenuOpen(false)}
        >
          2CORE<span className="text-magenta">STUDIO</span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-ink no-underline shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none ${
                pathname.startsWith(link.match) ? "border-magenta" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-3 md:gap-5">
          <SearchNav />

          <AccountMenu user={user} isAdmin={isAdmin} />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="cursor-pointer border-[3px] border-ink bg-surface px-2.5 py-1.5 text-ink shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none md:hidden"
          >
            <span className="font-mono text-sm font-bold leading-none">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="mt-4 flex flex-col gap-4 border-t-[3px] border-ink pt-4 md:hidden"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 font-mono text-[0.82rem] font-bold uppercase tracking-wider text-ink no-underline shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none ${
                pathname.startsWith(link.match) ? "border-magenta" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
