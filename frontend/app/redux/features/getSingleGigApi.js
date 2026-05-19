import { baseApi } from "../api/baseApi";

const getSingleGigApi= baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getSingleGig:builder.query({
            query:(id)=>`/gig/${id}`,
            providesTags:[ "Gigs", "updateGig"],
        })
    })
})

export const {useGetSingleGigQuery} = getSingleGigApi;