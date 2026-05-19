"use client";
import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { GoDotFill } from "react-icons/go";
import { useDispatch } from "react-redux";
import { setFeature } from "@/app/redux/slices/featureSlice";
import useUser from "@/hooks/useUser";
const ComparePackages = ({ packages, data, setOpen, open }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(packages ? packages[0] : null);
  const user = useUser(); // Get the user details

  useEffect(() => {
    if (packages && packages[0]) {
      dispatch(setFeature({ ...packages[0], gigTitle: data?.title, image: data?.images[0] }));
    }
  }, [packages, data, dispatch]);

  const onChange = (e) => {
    setValue(e.target.value);
    dispatch(setFeature({ ...e.target.value, gigTitle: data?.title, image: data?.images[0] }));
  };

  const isFreelancer = user?.role === 'freelancer'; // Check if the user is a freelancer

  return (
    <div>
      <h1 className="text-3xl font-semibold">Compare packages</h1>
      <div>
        <Radio.Group onChange={onChange} value={value} disabled={isFreelancer}>
          {packages?.map((item, index) => (
            <Radio
              key={index}
              value={item}
              className={`flex items-center border-t border-gray-300 py-5 ${isFreelancer ? 'cursor-not-allowed' : ''}`}
              onClick={() => !isFreelancer && setOpen(true)} // Prevent opening if the user is a freelancer
            >
              <div className="flex justify-between gap-5">
                <div>
                  <p className="text-xl font-medium">{item?.name}</p>
                  {item?.features?.map((feature, featureIndex) => (
                    <ul key={featureIndex}>
                      <li className="text-sm font-medium mt-2 flex items-center gap-2">
                        <GoDotFill size={12} /> {feature?.feature}
                      </li>
                    </ul>
                  ))}
                  <p className="text-lg font-semibold mt-3">
                    {item?.deliveryDate} day delivery
                  </p>
                </div>
                <p className="text-xl font-bold">${item.price}</p>
              </div>
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

export default ComparePackages;
