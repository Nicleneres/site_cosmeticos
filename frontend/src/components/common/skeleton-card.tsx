export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-blush-100 bg-white p-4 shadow-card">
      <div className="h-44 rounded-xl bg-blush-100" />
      <div className="mt-4 h-4 w-1/2 rounded bg-blush-100" />
      <div className="mt-2 h-3 w-full rounded bg-blush-100" />
      <div className="mt-2 h-3 w-4/5 rounded bg-blush-100" />
      <div className="mt-4 h-8 rounded-xl bg-blush-100" />
    </div>
  );
}
