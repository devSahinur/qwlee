"use client";
import { Select } from "antd";
const AllCardTopFilters = ({setSortBy }) => {
  const handleChange = (value) => {
    setSortBy(value.value);
  };
  return (
    <div className=" pt-10">
      <div className="flex gap-2 items-center ">
        <span>Sort by: </span>
        <Select
          labelInValue
          className="w-[140px] md:w-[180px] md:h-[30px] "
          defaultValue={{
            value: "online",
            label: "Online",
          }}
          onChange={handleChange}
          options={[
            {
              value: "online",
              label: "Online",
            },
            {
              value: "offline",
              label: "Offline",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AllCardTopFilters;
