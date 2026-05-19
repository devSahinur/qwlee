"use client";
import { useGetAllCategoryQuery } from "@/app/redux/features/getAllCategoryApi";
import { Input, Radio, Checkbox, Select, Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";

const { Option } = Select;

const priceData = [
  { id: 1, text: "Value", price: "Under $20" },
  { id: 2, text: "Mid-range", price: "$20-$60" },
  { id: 3, text: "High-end", price: "$60 & Above" },
  { id: 4, text: "Custom", price: "Custom" },
];

const Filters = () => {
  const [customPrice, setCustomPrice] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: responseAllCategoriesData } = useGetAllCategoryQuery({});
  const categoriesData = responseAllCategoriesData?.results?.map(
    (category) => ({
      id: category.id,
      text: category.name,
    })
  );

  useEffect(() => {
    const categoriesFromParams =
      searchParams.get("categories")?.split(",") || [];
    setSelectedCategories(categoriesFromParams);
  }, [searchParams]);

  const getPriceRange = (priceText) => {
    switch (priceText) {
      case "Under $20":
        return { minPrice: 0, maxPrice: 20 };
      case "$20-$60":
        return { minPrice: 20, maxPrice: 60 };
      case "$60 & Above":
        return { minPrice: 60, maxPrice: undefined };
      default:
        return {
          minPrice: customPrice ? Number(customPrice) : undefined,
          maxPrice: undefined,
        };
    }
  };

  const handlePrice = (priceText) => {
    setSelectedPriceRange(priceText);
    if (priceText !== "Custom") {
      setCustomPrice("");
      updateQuery(priceText);
    }
  };

  const handleCustomPriceChange = (e) => {
    setCustomPrice(e.target.value);
  };

  const handleCustomPriceEnter = (e) => {
    if (e.key === "Enter" && customPrice) {
      updateQuery("Custom");
      setCustomPrice("");
    }
  };

  const handleCustomPriceBlur = () => {
    if (customPrice) {
      updateQuery("Custom");
      setCustomPrice("");
    }
  };

  const updateQuery = (priceText) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    const range = getPriceRange(priceText);

    if (range.minPrice !== undefined) {
      currentQuery.set("minPrice", range.minPrice);
    } else {
      currentQuery.delete("minPrice");
    }

    if (range.maxPrice !== undefined) {
      currentQuery.set("maxPrice", range.maxPrice);
    } else {
      currentQuery.delete("maxPrice");
    }

    router.push(`/gig?${currentQuery.toString()}`, { scroll: false });
  };

  const handleCategories = (checkedCategories) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    if (checkedCategories.length === 0) {
      currentQuery.delete("categories");
    } else {
      currentQuery.set("categories", checkedCategories.join(","));
    }
    router.push(`/gig?${currentQuery.toString()}`, { scroll: false });
    setSelectedCategories(checkedCategories);
  };

  const handleReset = () => {
    router.push(`/gig`, { scroll: false });
    setSelectedCategories([]);
    setSelectedPriceRange("");
    setCustomPrice("");
  };

  // Reusable Price Filter Component
  const PriceFilter = () => (
    <div className="w-full">
      <label className="block mb-2 text-gray-700 font-medium">Price</label>
      {/** For mobile, using Select, for desktop using Radio */}
      <Select
        value={selectedPriceRange}
        onChange={handlePrice}
        className="w-full text-green-500 md:hidden"
        placeholder="Price"
      >
        {priceData.map((item) => (
          <Option key={item.id} value={item.price}>
            {item.text}
          </Option>
        ))}
      </Select>

      {/** Custom Price Input for both mobile and desktop */}
      {selectedPriceRange === "Custom" && (
        <Input
          type="number"
          value={customPrice}
          onChange={handleCustomPriceChange}
          onKeyDown={handleCustomPriceEnter}
          onBlur={handleCustomPriceBlur}
          className="mt-2"
          placeholder="Enter minimum budget"
          suffix={<BsCurrencyDollar />}
        />
      )}

      {/** Desktop View */}
      <Radio.Group
        value={selectedPriceRange}
        onChange={(e) => handlePrice(e.target.value)}
        className="hidden md:flex flex-wrap flex-col gap-2"
      >
        {priceData?.map((item) => (
          <Radio key={item.id} value={item.price}>
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-[15px] font-semibold">
                {item.text}
              </span>
              <span className="text-gray-500">
                {item.price !== "Custom" && item.price}
              </span>
            </div>
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );

  // Reusable Categories Filter Component
  const CategoriesFilter = () => (
    <div className="w-full">
      <label className="block mb-2 text-gray-700 font-medium">Categories</label>

      {/** For mobile, using Select */}
      <Select
        mode="multiple"
        value={selectedCategories}
        onChange={handleCategories}
        className="w-full md:hidden"
        placeholder="Select Categories"
        maxTagCount="responsive"
      >
        {categoriesData?.map((item) => (
          <Option key={item.id} value={item.text}>
            {item.text}
          </Option>
        ))}
      </Select>

      {/** For desktop, using Checkbox */}
      <Checkbox.Group
        value={selectedCategories}
        onChange={handleCategories}
        className="hidden md:flex flex-wrap flex-col gap-2"
      >
        {categoriesData?.map((item) => (
          <Checkbox key={item.id} value={item.text}>
            <span className="text-textGray text-[15px]">{item.text}</span>
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );

  return (
    <>
      {/* Mobile version */}
      <div className="md:hidden flex flex-col gap-3 p-4">
        <PriceFilter />
        <CategoriesFilter />

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-5 py-1 rounded-xl border border-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
        >
          Reset
        </button>
      </div>

      {/* Desktop version */}
      <div
        style={{
          boxShadow: "0px 0px 24px 0px #0000001A",
        }}
        className="p-2 md:p-5 rounded-lg hidden md:block"
      >
        <div className="space-y-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[20px] font-medium">Filters</h1>
            <button
              onClick={handleReset}
              className="px-5 py-1 rounded-xl border border-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
            >
              Reset
            </button>
          </div>

          {/* Price */}
          <PriceFilter />

          {/* Categories */}
          <CategoriesFilter />
        </div>
      </div>
    </>
  );
};

export default Filters;
