"use client";
import useUser from "@/hooks/useUser";
import moment from "moment";
import Avatar from "@/components/common/Avatar";
import BecomeSellerCta from "@/components/Dashboard/BecomeSellerCta";

const BuyerOverviewCard = () => {
  const user = useUser();
  return (
    <div
      style={{ boxShadow: "0px 0px 24px 0px #0000001A" }}
      className="p-4 md:p-6 rounded-lg bg-white"
    >
      <div className="flex items-center gap-5 mb-5">
        <Avatar src={user?.image} name={user?.fullName} size={80} rounded />
        <div>
          <h1 className="font-semibold">{user?.fullName}</h1>
          {user?.username ? (
            <p className="text-sm text-gray-500">@{user.username}</p>
          ) : null}
        </div>
      </div>
      <hr />
      <div className="mt-5 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">From</span>
          <span className="font-medium">{user?.location || "—"}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Language</span>
          <span className="font-medium">{user?.language || "—"}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Member since</span>
          <span className="font-medium">
            {user?.createdAt
              ? moment(user.createdAt).format("MMM YYYY")
              : "—"}
          </span>
        </div>
        {user?.about ? (
          <div>
            <div className="text-gray-500 text-sm mb-1">About</div>
            <p className="text-sm">{user.about}</p>
          </div>
        ) : null}
      </div>

      <BecomeSellerCta user={user} />
    </div>
  );
};

export default BuyerOverviewCard;
