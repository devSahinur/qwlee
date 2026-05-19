const { baseApi } = require("../api/baseApi");

const getAllGigForUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGigUser: builder.query({
            query: (id) => `/gig/public?userId=${id}`,
            providesTags: ["Gigs"]
        })
    }) 
})

export const { useGetAllGigUserQuery } = getAllGigForUserApi;