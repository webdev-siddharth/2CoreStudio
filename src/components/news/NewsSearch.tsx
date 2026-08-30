"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function NewsSearch({ query }: { query: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/news?q=${encodeURIComponent(q)}&page=1`);
    } else {
      router.push("/news");
    }
    inputRef.current?.blur();
  }

  function clear() {
    setValue("");
    router.push("/news");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="flex flex-1 items-center border-[3px] border-ink bg-surface shadow-[3px_3px_0_var(--ink)]">
        <span className="pointer-events-none shrink-0 pl-3 text-muted">
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
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="h-[34px] min-w-0 flex-1 bg-transparent px-3 font-mono text-xs text-text outline-none placeholder:text-muted"
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="shrink-0 cursor-pointer border-0 bg-transparent pr-3 text-muted transition-colors hover:text-text"
          >
            <span className="grid h-[14px] w-[14px] place-items-center font-mono text-xs font-bold leading-none">
              ✕
            </span>
          </button>
        )}
      </div>
      <button type="submit" className="nb-btn hidden sm:inline-block">
        SEARCH
      </button>
    </form>
  );
}
