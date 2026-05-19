import { imageBaseUrl, imgUrl} from "@/lib/constant";
import { Rate } from "antd";
import Image from "next/image";

const ReviewsCard = ({ item }) => {
  return (
    <div key={item.id} className="border p-2  rounded-lg">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            width={50}
            height={50}
            src={imgUrl(item?.userId?.image)}
            alt="buyerImage"
            className="rounded-full"
          />
          <div>
            <h1 className="text-[20px] font-medium">{item.userId?.fullName}</h1>
            <Rate
              className="text-primary"
              disabled
              allowHalf
              defaultValue={item.rating}
            />
          </div>
        </div>
        <p className="text-textGray font">{item?.createdAt?.split("T")[0]}</p>
      </div>
      <p className="text-textGray py-3 pl-3">{item.review}</p>
    </div>
  );
};

export default ReviewsCard;
