import { SkeletonCard } from "@/components/common/skeleton-card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-2/5 animate-pulse rounded bg-blush-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
