// Mirrors FreelancersCard's shape: avatar + name/username, intro,
// skill chips, footer row. Same border + padding so the grid stays
// stable across loading → loaded.

import { SkeletonBlock, SkeletonCircle } from "@/components/common/Skeleton";

export default function FreelancersCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start gap-3">
        <SkeletonCircle size={56} />
        <div className="flex-1 min-w-0 space-y-2">
          <SkeletonBlock className="h-3.5 w-32" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
        <SkeletonBlock className="h-3.5 w-14" />
      </div>

      <div className="mt-3 space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <SkeletonBlock className="h-5 w-14" rounded="rounded-full" />
        <SkeletonBlock className="h-5 w-16" rounded="rounded-full" />
        <SkeletonBlock className="h-5 w-12" rounded="rounded-full" />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3.5 w-16" />
      </div>
    </div>
  );
}
