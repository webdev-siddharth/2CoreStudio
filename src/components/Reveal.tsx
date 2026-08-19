"use client";

import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in ms — applied as a transition delay. */
  delay?: number;
  className?: string;
}

/** Safety net: reveal element that IO never caught intersecting. */
const REVEAL_FALLBACK_MS = 3000;

/**
 * Zero-dependency scroll reveal. Imperative opacity/translate styles are
 * applied post-mount and flipped by an IntersectionObserver (fires once),
 * so content renders fully visible in SSR/no-JS and stays static under
 * prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return; // leave fully visible, no animation
    }
    el.style.opacity = "0";
    el.style.transform = "translateY(1rem)";

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      clearTimeout(fallback);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Skip straight to revealed when the element scrolled past the
          // viewport without ever being observed intersecting (instant
          // jumps can skip frames entirely).
          if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
            reveal();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);

    const fallback = setTimeout(reveal, REVEAL_FALLBACK_MS);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`min-w-0 transition-[opacity,transform] duration-500 ease-out ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}