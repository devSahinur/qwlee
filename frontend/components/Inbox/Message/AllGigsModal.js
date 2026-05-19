import { imageBaseUrl, imgUrl} from "@/lib/constant";
import { Modal } from "antd";
import Image from "next/image";

const AllGigsModal = ({ isOpen, gigs, onClose, onSelectGig }) => {
  return (
    <Modal
      title={<h1 className="text-xl font-bold">Select a Gig</h1>}
      centered
      width={700}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div className="w-full flex flex-col gap-5 mt-4 h-[600px] overflow-y-scroll p-2 mt-4">
        {gigs?.map((gig) => (
          <div
            key={gig.id}
            onClick={() => onSelectGig(gig)}
            className="rounded border p-2 cursor-pointer"
          >
            <div className="flex gap-3">
              <Image
                src={imgUrl(gig?.images[0])}
                alt={gig.title}
                width={80}
                height={80}
                className="rounded"
              />
              <h3 className="font-semibold mt-2">{gig.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AllGigsModal;
