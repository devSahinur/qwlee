"use client";
import { useGetFreelancerStatsQuery } from "@/app/redux/features/getFreelancerStats";
import useUser from "@/hooks/useUser";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import { Rate } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";

// Utility function to format response time using moment.js
const formatTime = (timeInMinutes) => {
  const duration = moment.duration(timeInMinutes, "minutes");

  if (timeInMinutes < 60) {
    return `${duration.minutes()} min`;
  } else if (timeInMinutes < 1440) {
    // Less than 24 hours
    return `${duration.hours()} hours`;
  } else {
    return `${duration.days()} days`;
  }
};

const FreelancerMainCard = () => {
  const user = useUser();
  const router = useRouter();
  const { data: freelancerStats } = useGetFreelancerStatsQuery(user?.id, {
    skip: !user?.id,
  });

  // Format last response time and average response time
  const lastResponseTime = freelancerStats?.lastResponseTime
    ? formatTime(freelancerStats.lastResponseTime)
    : "0";

  const averageResponseTime = freelancerStats?.averageResponseTime
    ? formatTime(freelancerStats.averageResponseTime)
    : "0";

  return (
    <div
      style={{
        boxShadow: "0px 0px 24px 0px #0000001A",
      }}
      className="p-2 md:p-5 rounded-lg"
    >
      <Image
        src={imgUrl(user?.image)}
        width={200}
        height={200}
        className="w-[100px] h-[100px] rounded-full"
        alt="Profile"
      />
      <div className="flex justify-between mt-[16px] items-center">
        <h1 className="text-[20px] font-bold">{user?.fullName}</h1>
        <button
          onClick={() => router.push("/profile/edit")}
          className="text-primary hover:text-white hover:bg-primary transition-all border-primary border-2 rounded-lg px-5 py-1"
        >
          Edit Profile
        </button>
      </div>
      <div>
        <p className="text-[15px] text-textGray mt-[16px]">{user?.intro}</p>
        <p className="text-[17px] text-textGray font-medium my-[16px]">
          {user?.location}
        </p>
        <p className="text-textGray">{user?.about}</p>
        <div className="flex justify-between mt-[16px]">
          <span className="flex gap-2">
            <Rate disabled allowHalf defaultValue={user?.review?.rating} />
            <span className="text-yellow-500">{user?.review?.rating}</span>
            <span className="font-medium">({user?.review?.total})</span>
          </span>
          <p className="font-bold">Average ${user?.perHourRate}</p>
        </div>
        <div>
          <p className="text-[17px] text-textGray font-medium my-[16px]">
            Skills
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.skills?.map((skill, i) => {
              // Skills can arrive as strings (legacy) or {id, text} objects.
              // Either way, derive a stable key + label safely.
              const text =
                typeof skill === "string"
                  ? skill
                  : skill?.text || skill?.name || "";
              if (!text) return null;
              const key = (typeof skill === "object" && skill?.id) || `skill-${i}-${text}`;
              return (
                <div
                  key={key}
                  className="bg-[#F5F5F5] px-2 py-1 text-[12px] cursor-pointer"
                >
                  {text}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-[17px] font-medium my-[16px]">Insights</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex justify-between items-center w-full">
              <p className="text-textGray font-medium">Projects worked on</p>
              <p className="text-textGray font-medium">
                {freelancerStats?.totalOrders
                  ? freelancerStats?.totalOrders
                  : "0"}
              </p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-textGray font-medium">Buyers worked with</p>
              <p className="text-textGray font-medium">
                {freelancerStats?.uniqueClientCount
                  ? freelancerStats?.uniqueClientCount
                  : "0"}
              </p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-textGray font-medium">Last Response</p>
              <p className="text-textGray font-medium">{lastResponseTime}</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-textGray font-medium">Average Response Time</p>
              <p className="text-textGray font-medium">{averageResponseTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerMainCard;
