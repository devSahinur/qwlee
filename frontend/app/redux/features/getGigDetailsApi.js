import { baseApi } from "../api/baseApi";

const getGigDetailsApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getGigDetails:builder.query({
            query:(slug)=>`/gig?slug=${slug}`,
            // providesTags:["Users"]
        })
    })
})

export const {useGetGigDetailsQuery} = getGigDetailsApi;