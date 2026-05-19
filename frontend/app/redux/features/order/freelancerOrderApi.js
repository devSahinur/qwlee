const { baseApi } = require("../../api/baseApi");

const freelancerOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFreelancerAllOrder: builder.query({
      query: ({ status, limit = 100, page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (limit) params.append("limit", limit);
        if (page) params.append("page", page);
        return {
          url: "/orders/freelancer",
          method: "GET",
          params,
        };
      },
      transformResponse: (data) => data?.data?.attributes,
      providesTags: ["Orders"],
    }),
    getOrderCounts: builder.query({
      query: (role = "buyer") => ({
        url: `/orders/counts?role=${role}`,
        method: "GET",
      }),
      transformResponse: (data) => data?.data?.attributes,
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetFreelancerAllOrderQuery,
  useGetOrderCountsQuery,
} = freelancerOrderApi;
