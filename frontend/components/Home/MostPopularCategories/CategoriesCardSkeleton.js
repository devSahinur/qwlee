// Mirrors CategoriesCard's icon-tile shape so the homepage doesn't
// reflow when categories load in.

import { SkeletonBlock } from "@/components/common/Skeleton";

export default function CategoriesCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 text-center">
      <div className="mx-auto w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-2xl qwlee-shimmer" />
      <SkeletonBlock className="h-3.5 w-2/3 mx-auto mt-3" />
    </div>
  );
}
