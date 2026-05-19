import { baseApi } from "../api/baseApi";

const getAllCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategory: builder.query({
            query: ({ search, sortBy }) => {
                const params = new URLSearchParams();
                if (search) params.set('name', search);
                if (sortBy) params.set('type', sortBy);
                return {
                    url: '/categories',
                    params: params,
                    providesTags: ['Categories'],
                    params

                }
            },
            transformResponse: (res) => res?.data?.attributes,
        })
    })
})

export const { useGetAllCategoryQuery } = getAllCategoryApi;