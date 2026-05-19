import { baseApi } from "../api/baseApi";

const getAllGigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGig: builder.query({
      query: ({ categories, minPrice, maxPrice, search }) => {
        const params = new URLSearchParams();
        if (search) params.append("title", search);
        if (categories) {
          categories.forEach((category) => params.append("categories", category));
        }
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (minPrice) params.append("minPrice", minPrice);
        return {
          url: "/gig",
          method: "GET",
          params: params,
        };
      },
      keepUnusedDataFor:0,
      providesTags: ["Gigs"],
    }),
  }),
});

export const { useGetAllGigQuery } = getAllGigApi;
