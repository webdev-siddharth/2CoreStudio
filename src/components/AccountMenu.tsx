"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

const ITEM_CLASS =
  "block w-full cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 text-left font-mono text-[0.7rem] font-bold uppercase tracking-wider text-ink no-underline shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none";

const SIGN_OUT_CLASS =
  "block w-full cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 text-left font-mono text-[0.7rem] font-bold uppercase tracking-wider text-[var(--red)] no-underline shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none";

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c0-3.6 3.36-5.5 7.5-5.5s7.5 1.9 7.5 5.5" />
    </svg>
  );
}

export function AccountMenu({
  user,
  isAdmin,
}: {
  user: { id: string; email: string } | null;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // keep going — navigation happens regardless
    }
    close();
    router.push("/profile");
    router.refresh();
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer border-[3px] border-ink bg-surface p-1.5 text-ink shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <PersonIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 border-[3px] border-ink bg-surface shadow-[6px_6px_0_var(--ink)]"
        >
          {user && (
            <div className="flex items-center gap-2.5 border-b-[3px] border-dashed border-ink px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-ink bg-surface2 text-magenta">
                <PersonIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-[0.65rem] leading-tight text-ink">
                {user.email}
              </span>
            </div>
          )}

          <div className="space-y-2 p-3">
            <Link href="/profile" role="menuitem" onClick={close} className={ITEM_CLASS}>
              {user ? "Profile" : "Sign in / Sign up"}
            </Link>

            {user && (
              <Link
                href="/profile#downloads"
                role="menuitem"
                onClick={close}
                className={ITEM_CLASS}
              >
                My downloads
              </Link>
            )}

            {user && isAdmin && (
              <Link href="/admin" role="menuitem" onClick={close} className={ITEM_CLASS}>
                Admin console
              </Link>
            )}

            {user && (
              <button
                type="button"
                role="menuitem"
                onClick={signOut}
                className={SIGN_OUT_CLASS}
              >
                Sign out
              </button>
            )}
          </div>

          <div className="border-t-[3px] border-dashed border-ink p-3">
            <ThemeToggle className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}