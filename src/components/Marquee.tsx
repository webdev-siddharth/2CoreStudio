const ITEMS = [
  "★ NEW DROP THIS WEEK",
  "◆ MULTI-PLATFORM DOWNLOADS",
  "★ 2CORESTUDIO CATALOG",
  "◆ INSTANT PLAY, NO ACCOUNT",
];

/** Alternating magenta/orange marquee strip — brand signature. */
export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-wrap" aria-hidden>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
