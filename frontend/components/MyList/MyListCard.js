import { usePostDisLoveMutation } from "@/app/redux/features/postDisLoveApi";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { toast } from "sonner";

function MyListCard({ item }) {
  const [setDisLoveId] = usePostDisLoveMutation();
  const handleDisLoveReact = async () => {
    const response = await setDisLoveId(item?.gigId?._id);
    if (response?.data?.code === 201) {
      toast.success("The item remove in My list.");
    }
  };
  return (
    <div
      style={{ boxShadow: "0px 0px 24px 0px #0000001A" }}
      className="flex gap-2 flex-col border rounded-lg"
    >
      <Link href={`/gig/${item?.gigId?.slug}`}>
        <div className="w-full h-[180px] relative">
          {item?.gigId?.images[0] && (
            <Image
              src={imgUrl(item?.gigId?.images[0])}
              alt="gig"
              className="rounded-t-lg absolute"
              fill
            />
          )}
        </div>
        <div className="px-3 py-2 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Image
                  width={40}
                  height={40}
                  src={imgUrl(item?.gigId?.userId?.image)}
                  alt="freelancerImage"
                  className="rounded-full"
                />
                {item?.gigId?.userId?.online && (
                  <div
                    className={`absolute right-1 ring-1 ring-white bottom-0 size-[8px] rounded-full bg-green-500`}
                  />
                )}
              </div>
              <div>
                <p className="text-[14px] font-bold">
                  {item?.gigId?.userId?.fullName}
                </p>
                <div className="flex gap-1">
                  <IoStar className="text-primary" />
                  <p className="text-[12px] text-primary">
                    {item?.gigId?.userId?.review?.rating}
                  </p>
                  <p className="text-[12px]">
                    ({item?.gigId?.userId?.review?.total || 0})
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[14px] font-bold">${item?.gigId?.price}</p>
          </div>
          <p className="h-[70px]">{item?.gigId?.title}</p>
          <div className="flex flex-wrap gap-2 mt-8">
            {item?.gigId?.userId?.skills?.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#F5F5F5] px-2 py-1 text-[12px] cursor-pointer"
              >
                {skill?.text}
              </div>
            ))}
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-center px-3 py-2">
        <p className="text-[14px] text-textGray">Delivered in 5 days</p>
        <button onClick={handleDisLoveReact}>
          <FaTrash className="size-4 -mt-3 text-rose-500 z-30" />
        </button>
      </div>
    </div>
  );
}

export default MyListCard;
