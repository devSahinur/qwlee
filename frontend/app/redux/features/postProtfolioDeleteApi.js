import { baseApi } from "../api/baseApi";

const postProtfolioDeleteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postProtfolioDelete: builder.mutation({
        query: (id) => {
            return {
              url: `/portfolio/${id}`,
              method: 'DELETE',
          } 
        },
        invalidatesTags: ["Portfolio"],
      }),
    }),
   
  });
  
  export const { usePostProtfolioDeleteMutation } = postProtfolioDeleteApi;