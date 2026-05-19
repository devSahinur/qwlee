import { usePostProtfolioDeleteMutation } from "@/app/redux/features/postProtfolioDeleteApi";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import { Image } from "antd";
import React from "react";
import { TiDelete } from "react-icons/ti";
import { toast } from "sonner";
function PortfolioCard({ data }) {
  const [setDeleteData] = usePostProtfolioDeleteMutation();
  const handleRemoveImage = async (id) => {
    try {
      const response = await setDeleteData(id);
      if (response?.error) {
        toast.error(`${response?.error?.data?.message}`);
        return
      }
      if (response?.data?.code === 200) {
        toast.success(`${response?.data?.message}`);
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };
  return (
    <div className="w-full h-[200px] relative">
      <Image
        width="100%"
        height="100%"
        src={imgUrl(data?.image)}
        className=" rounded-lg my-2"
        alt="Portfolio Image"
      />
      <TiDelete
        size={25}
        style={{
          position: "absolute",
          top: "-3px",
          right: "-10px",
          color: "red",
          cursor: "pointer",
        }}
        onClick={() => handleRemoveImage(data?._id)}
      />
    </div>
  );
}

export default PortfolioCard;
