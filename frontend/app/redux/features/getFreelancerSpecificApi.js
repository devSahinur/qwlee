import { baseApi } from "../api/baseApi";

const getFreelancerSpecificApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getFreelancerSpecific:builder.query({
            query:(id)=>`/users/public?userId=${id}`,
            // providesTags:["Users"]
        })
    })
})

export const {useGetFreelancerSpecificQuery} = getFreelancerSpecificApi;