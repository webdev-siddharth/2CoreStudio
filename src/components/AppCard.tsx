"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { AppRow } from "@/lib/types";

export const ACCESS_TIER_LABELS: Record<string, string> = {
  instant: "Instant play",
  account: "Account",
  premium: "Premium",
};

/**
 * Catalog card. CSS-only 3D tilt (small, tactile) — listeners are only
 * attached on hover-capable devices without reduced-motion.
 */
export function AppCard({ app }: { app: AppRow }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [canTilt] = useState(() => {
    if (typeof window === "undefined") return false;
    const hover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return hover && !reduced;
  });

  const onPointerMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el || !canTilt) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
    el.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const onPointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <Link
      ref={cardRef}
      href={`/apps/${app.slug}`}
      className="nb-card tilt-card card-spotlight flex flex-col no-underline"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
<div className="mb-3.5 h-[110px] overflow-hidden border-[3px] border-ink">
        {app.thumbnail_url ? (
          <Image
            src={app.thumbnail_url}
            alt=""
            width={640}
            height={360}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-[repeating-linear-gradient(45deg,var(--primary),var(--primary)_10px,var(--secondary)_10px,var(--secondary)_20px)]" />
        )}
      </div>
      <div className="card-title display text-lg text-text">{app.title}</div>
      <div className="mb-3.5 mt-2 flex gap-2">
        <span className="nb-tag nb-tag--a">{app.category}</span>
        <span className={`nb-tag nb-tag--b`}>
          {ACCESS_TIER_LABELS[app.access_tier] ?? app.access_tier}
        </span>
        {app.is_premium && <span className="nb-tag nb-tag--a">Premium</span>}
      </div>
      <p className="mb-4 flex-1 text-[0.78rem] leading-relaxed text-muted">
        {app.description}
      </p>
      <span className="nb-btn nb-btn--secondary self-start">View →</span>
    </Link>
  );
}
