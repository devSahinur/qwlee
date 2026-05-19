const { baseApi } = require("../api/baseApi");

const getSingleUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: ["SingeUser"]
        })
    })
})

export const { useGetUserQuery } = getSingleUserApi;