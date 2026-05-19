"use client";
import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

import { Navigation } from "swiper/modules";
import { useGetAllCategoryQuery } from "@/app/redux/features/getAllCategoryApi";
const SecondaryNavbar = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { data: responseCategoryData } = useGetAllCategoryQuery({});
  const categories = responseCategoryData?.results?.map((category) => ({
    id: category._id,
    text: category.name,
  }));

  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.on("slideChange", () => {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
      });
    }
  }, [swiperInstance]);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <div className="hidden md:block custom-box-shadow">
      <div className="container py-3">
        <Swiper
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          breakpoints={{
            "@0.00": {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            "@0.75": {
              slidesPerView: 4,
              spaceBetween: 50,
            },
            "@1.00": {
              slidesPerView: 6,
              spaceBetween: 40,
            },
            "@1.50": {
              slidesPerView: 6,
              spaceBetween: 40,
            },
          }}
          // navigation={true}
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
        >
          {/* Arrow buttons */}
          <div
            className="swiper-button-prev"
            style={{
              display: isBeginning ? "none" : "block",
              color: "#00BF63",
              opacity: "40%",
            }}
            onClick={handlePrev}
          ></div>
          <div
            className="swiper-button-next"
            style={{
              display: isEnd ? "none" : "block",
              color: "#00BF63",
              opacity: "40%",
            }}
            onClick={handleNext}
          ></div>
          {categories?.map((item) => (
            <SwiperSlide key={item?.text}>
              <Link href={`/gig?categories=${item?.text}`}>
                <div className="cursor-pointer text-[16px] hover:text-primary hover:font-medium font-normal text-center px-2 ">
                  {item.text}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
