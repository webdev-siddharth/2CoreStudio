export function UnderConstruction({
  title,
  subtitle,
  blurb,
}: {
  title: string;
  subtitle: string;
  blurb: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="display text-3xl text-ink">{title}</h1>
      <p className="mt-2 mb-8 font-mono text-xs uppercase tracking-widest text-muted">
        {subtitle}
      </p>
      <div className="nb-card max-w-2xl">
        <p className="display text-base text-ink">UNDER CONSTRUCTION</p>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted">{blurb}</p>
      </div>
    </section>
  );
}
