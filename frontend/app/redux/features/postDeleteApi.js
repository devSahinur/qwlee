import { baseApi } from "../api/baseApi";

const postDeleteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postDelete: builder.mutation({
        query: ({gigId,imagePath}) => {
            return {
              url: `/gig?gigId=${gigId}&imagePath=${imagePath}`,
              method: 'DELETE',
            //   body: data,
            
          } 
        },
        invalidatesTags: ["Gigs", "updateGig"],
      }),
    }),
   
  });
  
  export const { usePostDeleteMutation } = postDeleteApi;