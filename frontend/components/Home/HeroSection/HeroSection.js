"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import { useGetBannerImagesQuery } from "@/app/redux/features/getBannerImages";
import { imageBaseUrl, imgUrl} from "@/lib/constant";


const HeroSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const {data:sliderDatas} = useGetBannerImagesQuery();

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
    <div>
      <div className="">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Swiper
            onSwiper={(swiper) => setSwiperInstance(swiper)}
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
                display: isBeginning ? "none" : "revert-layer",
                color: "#00BF63",
                opacity: "100%",
                fontSize: "20px !important",
                // backgroundColor: "#fff",
                // borderRadius: "50%",
                // width: "40px",
                // height: "40px",
              }}
              onClick={handlePrev}
            ></div>
            <div
              className="swiper-button-next"
              style={{
                display: isEnd ? "none" : "revert-layer",
                color: "#00BF63",
                opacity: "100%",
                fontSize: "20px !important",
                // backgroundColor: "#fff",
                // borderRadius: "50%",
                // width: "40px",
                // height: "40px",
              }}
              onClick={handleNext}
            ></div>

            {sliderDatas?.map((data) => (
              <SwiperSlide key={data._id}>
                <Image
                  src={imgUrl(data?.image)}
                  className="w-full h-[332px] md:h-[100vh] object-cover "
                  width={1920}
                  height={865}
                  alt="hero image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
