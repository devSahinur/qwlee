// Mirrors BlogCard's 16:10 image area + meta/title/description/cta
// stack so the blog row keeps its height during load.

import { SkeletonBlock } from "@/components/common/Skeleton";

export default function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="w-full aspect-[16/10] bg-gray-100 qwlee-shimmer" />
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <div className="space-y-2 pt-1">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-5/6" />
        </div>
        <div className="mt-auto pt-2">
          <SkeletonBlock className="h-3.5 w-24" />
        </div>
      </div>
    </div>
  );
}
