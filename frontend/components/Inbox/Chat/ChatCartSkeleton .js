const ChatCartSkeleton = () => {
  return (
    <div className="w-full p-2.5 flex gap-3 bg-[#f5f5f5] my-2 rounded-xl animate-pulse">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gray-300" />
        <div className="absolute right-2 bottom-0.5 w-[8px] h-[8px] rounded-full bg-gray-300" />
      </div>
      <div className="w-[80%] flex justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-300 rounded w-24" />
          <div className="h-3 bg-gray-300 rounded w-36" />
        </div>
        <div className="h-3 bg-gray-300 rounded w-16" />
      </div>
    </div>
  );
};

export default ChatCartSkeleton;
