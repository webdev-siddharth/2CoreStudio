"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (q) router.push(`/apps?search=${encodeURIComponent(q)}`);
    setQuery("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search software"
        aria-expanded={false}
        className="cursor-pointer border-[3px] border-ink bg-surface p-2 text-text shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-primary active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="fixed inset-x-0 top-0 z-50 flex items-center gap-2 border-b-[3px] border-ink bg-surface px-5 py-4 shadow-[0_4px_0_var(--ink)] sm:static sm:z-auto sm:flex-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
    >
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQuery("");
            setOpen(false);
          }
        }}
        onBlur={() => setOpen(false)}
        placeholder="SEARCH…"
        aria-label="Search software"
        className="nb-input h-[35px] min-w-0 flex-1 sm:w-52 sm:flex-none"
      />
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setOpen(false);
        }}
        aria-label="Close search"
        className="cursor-pointer border-[3px] border-ink bg-surface p-2 text-text shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-primary active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <span className="grid h-[15px] w-[15px] place-items-center font-mono text-xs font-bold leading-none">✕</span>
      </button>
    </form>
  );
}
