import { baseApi } from "../api/baseApi";

const postPortfolioApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      postPortfolio: builder.mutation({
        query: (data) => {
            return {
              url: `/portfolio`,
              method: 'POST',
             
              body: data,
            
          } 
        },
        invalidatesTags: ["Portfolio", "User"],
      }),
    }),
   
  });
  
  export const { usePostPortfolioMutation } = postPortfolioApi;