import Image from "next/image";
import noInbox from "../../../assest/image/noinbox.png";
const Blank = () => {
  return (
    <div className="w-full h-full flex flex-col text-center justify-center items-center p-5">
      <div>
        <Image
          width={120}
          height={120}
          className=" mx-auto"
          src={noInbox}
          alt=""
        />
        <h1 className="text-2xl font-bold mt-4">Ah, a fresh new inbox</h1>
        <h2 className="my-4">
          You haven’t started any conversations yet, <br /> but when you do,
          you’ll find them here.
        </h2>
      </div>
    </div>
  );
};

export default Blank;
