export default function AppsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 h-9 w-56 border-[3px] border-ink bg-surface" />
      <div className="mb-5 flex flex-wrap gap-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 border-[3px] border-ink bg-surface" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="nb-card">
            <div className="mb-3.5 h-[110px] border-[3px] border-ink bg-surface2" />
            <div className="mb-3 h-5 w-2/3 border-2 border-ink bg-surface2" />
            <div className="mb-3 h-5 w-1/3 border-2 border-ink bg-surface2" />
            <div className="mb-4 h-14 w-full border-2 border-ink bg-surface2" />
            <div className="h-9 w-24 border-[3px] border-ink bg-surface2" />
          </div>
        ))}
      </div>
    </div>
  );
}
