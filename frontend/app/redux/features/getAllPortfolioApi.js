import { baseApi } from "../api/baseApi";

const getAllPortfolio = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllPortfolio:builder.query({
            query:(id)=>`/portfolio?userId=${id}`,
            providesTags:["Portfolio"]
        })
    })
})

export const {useGetAllPortfolioQuery} = getAllPortfolio;