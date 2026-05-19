import { baseApi } from "../api/baseApi";

const postGigImageUpoadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postGigImageUpoad: builder.mutation({
        query: ({gigId,formData}) => {
            return {
              url: `/gig/image?gigId=${gigId}`,
              method: 'POST',
              body: formData,
            
          } 
        },
        invalidatesTags: ["Gigs", "updateGig"],
      }),
    }),
   
  });
  
  export const { usePostGigImageUpoadMutation } = postGigImageUpoadApi;