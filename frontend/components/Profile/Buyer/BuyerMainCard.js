"use client";
import useUser from "@/hooks/useUser";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
const BuyerMainCard = () => {
  const user = useUser();
  const router = useRouter();
  return (
    <div
      style={{
        boxShadow: "0px 0px 24px 0px #0000001A",
      }}
      className="p-2 md:p-5 rounded-lg"
    >
      {user?.image && (
        <Image
          src={imgUrl(user?.image)}
          width={200}
          height={200}
          className="w-[100px] h-[100px] mx-auto rounded-full"
          alt="Profile"
        />
      )}
      <h1 className="text-[20px] font-bold text-center py-3">
        {user?.fullName}
      </h1>
      <div className="flex justify-center items-center">
        <button
          onClick={() => router.push("/profile/edit")}
          className="w-96 mx-auto text-primary hover:text-white hover:bg-primary transition-all border-primary border rounded-lg px-8 py-1"
        >
          Edit Profile
        </button>
      </div>
      <div className="py-3 space-y-2">
        <div className="flex justify-between items-center">
          <h1>Language : </h1>
          <p>{user?.language}</p>
        </div>
        <div className="flex justify-between items-center">
          <h1>Form : </h1>
          <p>{user?.location}</p>
        </div>
        <div className="flex justify-between items-center">
          <h1>Member Since : </h1>
          <p>{moment(user?.createdAt).format("MMM DD, YYYY")}</p>
        </div>
      </div>
      <div className="py-2">
        <h1>{user?.about}</h1>
      </div>
    </div>
  );
};

export default BuyerMainCard;
