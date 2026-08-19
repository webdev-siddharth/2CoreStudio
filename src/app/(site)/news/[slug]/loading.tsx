export default function PostDetailLoading() {
  return (
    <div>
      <div className="relative h-[40svh] overflow-hidden border-b-[3px] border-ink bg-surface">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28">
          <div className="h-3 w-32 border-2 border-ink bg-surface2" />
          <div className="mt-4 h-12 w-2/3 border-[3px] border-ink bg-surface2 sm:w-1/2" />
          <div className="mt-4 h-16 w-full max-w-xl border-[3px] border-ink bg-surface2" />
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="space-y-4">
          <div className="h-16 w-full border-2 border-ink bg-surface2" />
          <div className="h-16 w-full border-2 border-ink bg-surface2" />
          <div className="h-16 w-3/4 border-2 border-ink bg-surface2" />
        </div>
      </div>
    </div>
  );
}