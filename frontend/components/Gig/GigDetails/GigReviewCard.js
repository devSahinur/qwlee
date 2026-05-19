// Single review row.

import moment from "moment";
import { IoStar } from "react-icons/io5";
import Avatar from "@/components/common/Avatar";

export default function GigReviewCard({ item }) {
  const reviewer = item?.userId || {};
  const rating = Number(item?.rating || 0);
  const stars = Math.round(rating);
  return (
    <div className="flex gap-3">
      <Avatar src={reviewer.image} name={reviewer.fullName} size={40} rounded />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {reviewer.fullName || "Customer"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {reviewer.location || ""}
            </div>
          </div>
          <div className="text-xs text-gray-500 shrink-0">
            {item?.createdAt ? moment(item.createdAt).format("D MMM YYYY") : ""}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <IoStar
              key={i}
              className={i < stars ? "text-amber-500" : "text-gray-200"}
            />
          ))}
          <span className="ml-1 font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          {item?.review}
        </p>
      </div>
    </div>
  );
}
