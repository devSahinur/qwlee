// Mirrors GigCard's shape so the grid doesn't reflow when results load.

import { SkeletonBlock, SkeletonCircle } from "@/components/common/Skeleton";

export default function GigCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="w-full aspect-[16/10] bg-gray-100 qwlee-shimmer" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="flex items-center gap-2.5">
          <SkeletonCircle size={32} />
          <div className="flex-1 space-y-1.5">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-2.5 w-14" />
          </div>
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-3.5 w-full" />
          <SkeletonBlock className="h-3.5 w-3/4" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <SkeletonBlock className="h-5 w-14" rounded="rounded-full" />
          <SkeletonBlock className="h-5 w-16" rounded="rounded-full" />
        </div>
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
