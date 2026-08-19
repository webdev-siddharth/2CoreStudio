export default function AppDetailLoading() {
  return (
    <div>
      <div className="relative h-[40svh] overflow-hidden border-b-[3px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28">
          <div className="h-3 w-24 border-2 border-ink bg-surface2" />
          <div className="mt-4 h-12 w-2/3 border-[3px] border-ink bg-surface2 sm:w-1/2" />
          <div className="mt-4 h-16 w-full max-w-xl border-[3px] border-ink bg-surface2" />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="h-16 w-full border-2 border-ink bg-surface2" />
          <div className="h-16 w-full border-2 border-ink bg-surface2" />
          <div className="h-16 w-3/4 border-2 border-ink bg-surface2" />
        </div>
        <div className="nb-card">
          <div className="mb-4 h-5 w-28 border-2 border-ink bg-surface2" />
          <div className="h-10 w-48 border-[3px] border-ink bg-surface2" />
        </div>
      </div>
    </div>
  );
}
