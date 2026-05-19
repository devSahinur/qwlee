"use client";
import useUser from "@/hooks/useUser";
import { imageBaseUrl } from "@/lib/constant";
import { Rate } from "antd";
import Image from "next/image";

const FreelancerOverviewCard = () => {
  const user = useUser();
  return (
    <div
      style={{
        boxShadow: "0px 0px 24px 0px #0000001A",
      }}
      className="p-4 md:p-6 rounded-lg bg-white"
    >
      <div className="flex items-center gap-5 mb-5">
        <Image
          src={imgUrl(user?.image)}
          width={90}
          height={90}
          className="size-20 rounded-full"
          alt="Profile"
        />
        <h1 className="font-semibold">{user?.fullName}</h1>
      </div>
      <hr />
      <div className="mt-5 space-y-5">
        <div className="flex justify-between items-center ">
          <h1>Rating : </h1>
          <Rate disabled allowHalf defaultValue={user?.review?.rating} />
        </div>
        <div className="flex justify-between items-center ">
          <h1>Response Time : </h1>
          <h1>{user?.responseTime}</h1>
        </div>
        <div className="flex justify-between items-center ">
          <h1>Location : </h1>
          <h1>{user?.location}</h1>
        </div>
        <div className="flex justify-between items-center ">
          <h1>Language : </h1>
          <h1>{user?.language}</h1>
        </div>
      </div>
    </div>
  );
};

export default FreelancerOverviewCard;
