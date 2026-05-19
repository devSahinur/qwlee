import { baseApi } from "../api/baseApi";

const postForgotPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postForgotPassword: builder.mutation({
        query: (data) => {
            return {
              url: `/auth/forgot-password`,
              method: 'POST',
              body: data,
            
          } 
        },
        // invalidatesTags: ["Portfolio"],
      }),
    }),
   
  });
  
  export const { usePostForgotPasswordMutation } = postForgotPasswordApi;