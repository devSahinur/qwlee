"use client";
import { useEffect } from "react";
import Image from "next/image";
import GigDescription from "./GigDescription";
import ComparePackages from "./ComparePackages";
import GigReviews from "./GigReviews";
import { useGetGigDetailsQuery } from "@/app/redux/features/getGigDetailsApi";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import useRecentlyViewed from "@/hooks/useRecentlyViewed";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const GigMainDetails = ({ slug, open, setOpen }) => {
  const { data } = useGetGigDetailsQuery(slug);
  const result = data?.data?.attributes?.results[0];
  const { record } = useRecentlyViewed();

  // Record this gig in the visitor's recently-viewed list once the
  // details arrive. Effect runs whenever the gig ID changes.
  useEffect(() => {
    if (result?._id || result?.id) record(result);
  }, [result?._id, result?.id, record]);

  return (
    <div className="md:w-2/3">
      <h1 className="text-xl md:text-3xl xl:text-4xl xxl:text-5xl font-medium pb-5">
        {result?.title}
      </h1>

      {/* gig images Swiper carousel */}
      <div className="rounded-xl">
        {result?.images?.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="rounded-xl"
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
            }}
          >
            {result?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative rounded-xl overflow-hidden">
                  <Image
                    src={imgUrl(image)}
                    layout="fill"
                    objectFit="cover"
                    alt={`gig demo ${index + 1}`}
                    className="rounded-xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* gig description */}
      <GigDescription content={result?.description} />

      {/* Compare packages */}
      <ComparePackages
        packages={result?.package}
        data={result}
        setOpen={setOpen}
        open={open}
      />

      {/* gig reviews */}
      <GigReviews id={result?._id} />
    </div>
  );
};

export default GigMainDetails;
