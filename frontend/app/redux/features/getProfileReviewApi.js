import { baseApi } from "../api/baseApi";

const getProfileReviewApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getProfileReview:builder.query({
            query:(currentPage)=>`/reviews?page=${currentPage}&limit=10`,
            // providesTags:["Users"]
        })
    })
})

export const {useGetProfileReviewQuery} = getProfileReviewApi;