import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select } from 'antd';
import { useGetIncomeRatioQuery } from '../redux/api/apiSlice';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="label font-semibold">{`Month: ${label}`}</p>
        <p className="intro">{`Total Earnings: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

const Barcharttwo = () => {
  const [year, setYear] = useState('2024');
  const { data: incomeRatio, error, isLoading } = useGetIncomeRatioQuery(year);
  
  

  const handleChange = (value) => {
    setYear(value);
  };

  return (
    <div>
      <div className="flex justify-between items-center pt-2 mx-6">
        <h1 className="font-medium text-6">Income Ratio</h1>
        <Select
          defaultValue={year}
          className="border-none"
          style={{
            width: 120,
            border: "none"
          }}
          onChange={handleChange}
          options={[
            { value: '2024', label: '2024' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' },
          ]}
        />
      </div>
      <hr className="text-[#B0EBCF] py-1 text-xl" />

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p> No data Available</p>
      ) : (
        <ResponsiveContainer width="100%" height={370}>
          <BarChart
            data={incomeRatio?.data?.attributes}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalEarnings" barSize={20} fill="#00BF63" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Barcharttwo;
