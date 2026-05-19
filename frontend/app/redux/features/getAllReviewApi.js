import { baseApi } from "../api/baseApi";

const getAllReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviewApi: builder.query({
      query: ({ userId, gigId }) => {
        let queryString = "/reviews";
        // Check if there are any query parameters
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        if (gigId) params.append("gigId", gigId);

        // If params exist, append to the URL
        if (params.toString()) {
          queryString += `?${params.toString()}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetAllReviewApiQuery } = getAllReviewApi;
