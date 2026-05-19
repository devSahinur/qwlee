import Image from "next/image";
import React from "react";

const MoneyProtectionGuarantee = () => {
  return (
    <div
      style={{
        boxShadow: "0px 0px 24px 0px #0000001A",
      }}
      className="p-3 md:p-5 rounded-lg"
    >
      <Image
        src="/orthers/guranteed.png"
        width={250}
        height={250}
        className="w-[100px] h-[85px]"
        alt="Money Protection Guarantee"
      />
      <h1 className="text-[24px] font-bold text-black mt-2">
        Money Protection Guarantee
      </h1>
      <p className=" text-textGray">Project done or your money back</p>
    </div>
  );
};

export default MoneyProtectionGuarantee;
