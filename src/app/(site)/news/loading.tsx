export default function NewsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-3 h-3 w-24 border-2 border-ink bg-surface2" />
      <div className="mb-8 h-11 w-72 border-[3px] border-ink bg-surface" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="nb-card">
            <div className="mb-4 aspect-video border-[3px] border-ink bg-surface2" />
            <div className="mb-3 h-3 w-28 border-2 border-ink bg-surface2" />
            <div className="mb-3 h-5 w-3/4 border-2 border-ink bg-surface2" />
            <div className="h-14 w-full border-2 border-ink bg-surface2" />
          </div>
        ))}
      </div>
    </div>
  );
}