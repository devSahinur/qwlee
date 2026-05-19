 
// // import React, { PureComponent } from 'react';
// // import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // const data = [
// //   {
// //     month: 'Jan',
     
// //     pv: 2400,
// //     amt: 2400,
// //   },
// //   {
// //     month: 'Feb',
    
// //     pv: 1398,
// //     amt: 2210,
// //   },
// //   {
// //     month: 'Mar',
// //     uv: 2000,
// //     pv: 9800,
// //     amt: 2290,
// //   },
// //   {
// //     month: 'Apr',
// //     uv: 2780,
// //     pv: 3908,
// //     amt: 2000,
// //   },
// //   {
// //     month: 'May',
// //     uv: 1890,
// //     pv: 4800,
// //     amt: 2181,
// //   },
// //   {
// //     month: 'Jun',
// //     uv: 2390,
// //     pv: 3800,
// //     amt: 2500,
// //   },
// //   {
// //     month: 'Jul',
// //     uv: 3490,
// //     pv: 5300,
// //     amt: 2100,
// //   },
// //   {
// //     month: 'Aug',
// //     uv: 3490,
// //     pv: 8300,
// //     amt: 2100,
// //   },
// //   {
// //     month: 'Sep',
// //     uv: 3490,
// //     pv: 7300,
// //     amt: 2100,
// //   },
// //   {
// //     month: 'Oct',
// //     uv: 3490,
// //     pv: 4300,
// //     amt: 2100,
// //   },
// //   {
// //     month: 'Nev',
// //     uv: 3490,
// //     pv: 9300,
// //     amt: 2100,
// //   },
// //   {
// //     month: 'Dec',
// //     uv: 2490,
// //     pv: 7300,
// //     amt: 2100,
// //   },
// // ];

// // // export default class Example extends PureComponent {
// // //   static demoUrl = 'https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5';
// // import { Select} from 'antd';
// // const handleChange = (value) => {
// //   console.log(`selected ${value}`);
// // };

// // const BarchartOne = () => {
// //     return (
// //         <div> 
// //            <div className='flex justify-between items-center pt-2 mx-6'>
// //             <h1 className=' font-medium text-6 '>Income Ratio</h1>
// //             <Select
// //       defaultValue="2024" className=' border-none'
// //       style={{
// //         width: 120,
// //         border:"none"
// //       }}
// //       onChange={handleChange}
// //       options={[
// //         {
// //           value: '2024',
// //           label: '2024',
// //         },
// //         {
// //           value: '2023',
// //           label: '2023',
// //         },
// //         {
// //           value: '2022',
// //           label: '2022',
// //         },
         
// //       ]}
// //     />
    
// //             </div>  
       
// //         <BarChart
// //            width={700}
          
// //            height={200}
// //           data={data}
// //           className=' mt-4'
// //         >
// //           <CartesianGrid padding={{ left: 10, right: 10 }} strokeDasharray="6 6"/>
// //           <XAxis  dataKey="month" />
// //           <YAxis  />
// //           <Tooltip />
          
// //           <Bar dataKey="pv" fill="#00BF63" activeBar={<Rectangle fill="#00BF63" stroke="blue" />} />
// //          </BarChart>
      
// //         </div>
// //     );
  
// // };

// // export default BarchartOne;



// import React, { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Select } from 'antd';
// import { useGetIncomeRatioQuery } from '../redux/api/apiSlice';

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="custom-tooltip">
//         <p className="label">{`${label} : ${payload[0].value}`}</p>
//         <p className="desc">Additional details can be shown here.</p>
//       </div>
//     );
//   }

//   return null;
// };

// const Barcharttwo = () => {
//   const [year, setYear] = useState('2024');
//   const { data: incomeRatio, error, isLoading } = useGetIncomeRatioQuery(year);

//   const handleChange = (value) => {
//     setYear(value);
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center pt-2 mx-6">
//         <h1 className="font-medium text-6">Income Ratio</h1>
//         <Select
//           defaultValue={year}
//           className="border-none"
//           style={{
//             width: 120,
//             border: "none"
//           }}
//           onChange={handleChange}
//           options={[
//             { value: '2024', label: '2024' },
//             { value: '2023', label: '2023' },
//             { value: '2022', label: '2022' },
//           ]}
//         />
//       </div>
//       <hr className="text-[#B0EBCF] py-1 text-xl" />

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>Error loading data</p>
//       ) : (
//         <ResponsiveContainer width="100%" height={380}>
//           <BarChart
//             data={incomeRatio?.data?.attributes}
//             margin={{
//               top: 5,
//               right: 30,
//               left: 20,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="totalEarnings" barSize={20} fill="#00BF63" />
//           </BarChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// };

// export default Barcharttwo;
