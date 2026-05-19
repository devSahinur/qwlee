"use client";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

function Breadcrumb({ title, path, pathTitle }) {
  const router = useRouter();
  return (
    <div className="bg-secondary">
      <div className="container mx-auto py-10 md:py-[100px] text-center">
        <h1 className="text-[#222222] font-bold text-[24px] md:text-[44px]">
          {title}
        </h1>
        <div className="flex justify-center mx-auto text-center">
          <p className="text-[#6B6B6B] text-[14px] flex items-center gap-1 ">
            <span onClick={() => router.push("/")} className="cursor-pointer">
              Home{" "}
            </span>{" "}
            <IoIosArrowForward />
            <span className="cursor-pointer">{pathTitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Breadcrumb;
