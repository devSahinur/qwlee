import { baseApi } from "../api/baseApi";

const getAllBlogs = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllBlogs:builder.query({
            query:()=>`/blog`,
            // providesTags:["Gigs"]
        })
    })
})

export const {useGetAllBlogsQuery} = getAllBlogs;