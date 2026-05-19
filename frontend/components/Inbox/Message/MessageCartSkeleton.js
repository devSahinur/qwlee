const MessageCartSkeleton = () => {
  return (
    <div className="flex items-end gap-5 ml-5 my-5 animate-pulse">
      {/* Placeholder for profile image */}
      <div className="w-[36px] h-[36px] rounded-full bg-gray-300"></div>

      {/* Placeholder for message content */}
      <div className="flex flex-col">
        <div className="w-[500px] bg-gray-300 h-12 rounded-[10px] mb-2"></div>
        <div className="w-[100px] bg-gray-300 h-4 rounded-[10px]"></div>
      </div>
    </div>
  );
};

export default MessageCartSkeleton;
