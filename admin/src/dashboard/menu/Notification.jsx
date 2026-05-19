// import React from 'react';
// import { IoIosArrowForward, IoMdNotificationsOutline } from 'react-icons/io';
// import { useGetNotificationQuery } from '../../redux/api/apiSlice';
 
// const Notification = () => {
// const {data: notifications, isLoading , error} = useGetNotificationQuery()

 
//    if(isLoading) <h1>Loading.....</h1>
//    // console.log("===========>",error)
// if (!notifications) {
//   <h1>Not Notification ........</h1>
// }
//     return (
//         <div className='mt-8 mx-6'>
//               <h1 className='font-semibold text-[30px]'>Notifications</h1>
            
//               <div className="mt-8">
//   {notifications?.data?.attributes?.results.length > 0 ? (
//     notifications.data.attributes.results.map(notification => (
//       <div className="flex border rounded mt-2 border-[#00BF63] items-center w-full h-[85px]" key={notification?.id}>
//         <div>
//           <IoMdNotificationsOutline className="h-12 w-12 ml-4 border rounded-full p-2 border-[#00BF63] text-[#00BF63]" />
//         </div>
//         <div>
//           <p className="text-[18px] ml-8 font-medium text-[#333333]">
//             {notification?.message}
//             <br />
//             {/* <span className="text-[#00BF63]">{notification?.role}</span> */}
//           </p>
//           <p className="text-[18px] ml-8 font-medium">
//             {notification?.createdAt?.split("T")[0] ? notification.createdAt.split("T")[0] : "N/A"}
//           </p>
//         </div>
//       </div>
//     ))
//   ) : (
//     <div className="text-center text-[18px] font-medium text-[#333333]">
//       No notifications available.
//     </div>
//   )}
// </div>

//         </div>
//     );
// };

// export default Notification;


import React from 'react';
import { IoIosArrowForward, IoMdNotificationsOutline } from 'react-icons/io';
import { useGetNotificationQuery } from '../../redux/api/apiSlice';
import { Pagination } from 'antd'; // Import Pagination from Ant Design
import { useState } from 'react';

const Notification = () => {
  // Fetching notifications using a Redux query hook
  const { data: notifications, isLoading, error } = useGetNotificationQuery();

  // State to manage current page and page size for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Default page size

  // Handling page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Paginated notifications
  const paginatedNotifications = notifications?.data?.attributes?.results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Loading and error states
  if (isLoading) return <h1>Loading.....</h1>;
  if (error || !notifications) return <h1>No Notifications Available</h1>;

  return (
    <div className='mt-8 mx-6'>
      <h1 className='font-semibold text-[30px]'>Notifications</h1>

      <div className='mt-8'>
        {paginatedNotifications?.length > 0 ? (
          paginatedNotifications.map((notification) => (
            <div
              className='flex border rounded mt-2 border-[#00BF63] items-center w-full h-[85px]'
              key={notification?.id}
            >
              <div>
                <IoMdNotificationsOutline className='h-12 w-12 ml-4 border rounded-full p-2 border-[#00BF63] text-[#00BF63]' />
              </div>
              <div>
                <p className='text-[18px] ml-8 font-medium text-[#333333]'>
                  {notification?.message}
                  <br />
                </p>
                <p className='text-[18px] ml-8 font-medium'>
                  {notification?.createdAt?.split('T')[0] || 'N/A'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-[18px] font-medium text-[#333333]'>
            No notifications available.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className='mt-4 flex justify-center'>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={notifications?.data?.attributes?.results.length || 0}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Notification;
