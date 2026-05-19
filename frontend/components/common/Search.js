"use client";
import { Input } from "antd";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

const Search = ({ title, placeholder, setSearch }) => {
  const handelSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    setSearch(e.target.value.value);
    form.reset();
  };
  return (
    <div className="flex justify-center items-center">
      <div className="mt-10">
        {title ? (
          <h1 className="text-center mb-4 text-xl md:text-3xl font-bold">
            {title}
          </h1>
        ) : null}
        <div className="bg-gray-200 p-2 rounded-full">
          <form onSubmit={handelSearch} className="relative">
            <input type="text" name="value" id="value" className="px-3 py-2 rounded-full outline-none" placeholder={placeholder} />
            <button type="submit" className="bg-primary rounded-full p-1 cursor-pointer absolute right-2 top-1.5 "><IoSearch className="w-[20px]  text-white h-[20px]" /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Search;
