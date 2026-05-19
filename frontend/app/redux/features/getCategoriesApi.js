import { baseApi } from "../api/baseApi";

const getCategories = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ({ search, sortBy }) => `/categories?name=${search}&type=${sortBy}`,
            providesTags: ["Categories"],
            // transformResponse: (res) => res?.data?.attributes?.result
        })
    })
})

export const { useGetCategoriesQuery } = getCategories;