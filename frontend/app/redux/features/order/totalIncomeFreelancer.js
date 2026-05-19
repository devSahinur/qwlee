const { baseApi } = require("../../api/baseApi");

const totalIncomeFreelancer = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTotalIncomeFreelancer: builder.query({
            query: () => ({
                url: "/orders/totalIncome",
                method: "GET"
            }),
            transformResponse: (data) => data?.totalIncome,
        })
    })
});
export const { useGetTotalIncomeFreelancerQuery } = totalIncomeFreelancer;
