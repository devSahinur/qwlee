"use client";
import Link from "next/link";
import ImageWithFallback from "@/components/common/ImageWithFallback";

function ServiceCard({ data }) {
  return (
    <Link href={`/gig?categories=${data?.name}`}>
      <div className="md:[250px] xl:w-[300px] h-[300px] md:h-[350px] cursor-pointer relative rounded-lg border border-gray-300">
        {/* Background Image */}
        <div className="absolute  inset-0">
          <ImageWithFallback
            src={data?.image}
            name={data?.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            alt={data?.name || "category"}
            className="rounded-lg"
          />
        </div>

        {/* Overlay Content */}
        <div
          className={`absolute bottom-0  rounded-b-lg  left-0 right-0 px-5 py-2   ${
            data.type === "offline" ? "bg-green-400" : "bg-custom-green"
          } rounded-tl-6`}
        >
          {/* <p className="text-sm text-white">{data?.description}</p> */}
          <h1 className="text-lg font-bold text-white">{data?.name}</h1>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCard;
