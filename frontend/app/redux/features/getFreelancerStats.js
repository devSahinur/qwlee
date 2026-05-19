const { baseApi } = require("../api/baseApi");

const getFreelancerStats = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFreelancerStats: builder.query({
      query: (userId) => ({
        url: `/users/stats/${userId}`,
        method: "GET",
      }),
      transformResponse: (data) => data?.data?.attributes,
    }),
  }),
});

export const {useGetFreelancerStatsQuery} = getFreelancerStats
