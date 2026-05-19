
// import { instance as axiosInstance } from '@/helpers/axios/axiosInstance';
import { authKey, baseUrl } from '@/lib/constant';
import { decodedToken } from '@/utils/jwt';
import baseURL from '@/lib/config';

import {
   getFromLocalStorage,
   removeFromLocalStorage,
   setToLocalStorage,
} from '@/utils/local-storage';
import Cookies from 'js-cookie';


export const storeUserInfo = ({ accessToken }) => {
   return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
   const authToken = getFromLocalStorage(authKey);
   if (authToken) {
      const decodedData = decodedToken(authToken);
      return {
         ...decodedData,
         role: decodedData?.role?.toLowerCase(),
      };
   } else {
      return '';
   }
};

export const isLoggedIn = () => {
   const authToken = getFromLocalStorage(authKey);
   if (authToken) {
      return !!authToken;
   }
};


export const removeUser = () => {
   return removeFromLocalStorage(authKey);
};


export const getNewAccessToken = async () => {
   return await axiosInstance({
      url: `${baseUrl}/auth/refresh-tokens`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
   });
   return
};




export const logout = async (refreshToken) => {
   refreshToken = refreshToken.replace(/^"(.*)"$/, '$1');
 
   try {
     const response = await baseURL.post("/auth/logout", { refreshToken: refreshToken }, {
       headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${Cookies.get("accessToken")}`,
       }
     });
     return response.data;
   } catch (error) {
     if (error.response) {
       console.error("Error data:", error.response.data);
     } else {
       console.error("Error during logout request:", error.message);
     }
     throw error; // rethrow the error after logging it
   }
 };