const { baseApi } = require("../api/baseApi");

const getInfo = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivacy: builder.query({
            query: () => ({
                url: "/info/privacy",
                method: "GET"
            }),
            transformResponse: (data) => data?.data?.attributes,
        }),
        getTermsAndConditions:builder.query({
            query: () => ({
                url: "/info/terms",
                method: "GET"
            }),
            transformResponse: (data) => data?.data?.attributes,
        }),
        getTrustSafety: builder.query({
            query: () => ({
                url: "/info/trust-safety",
                method: "GET"
            }),
            transformResponse: (data) => data?.data?.attributes,
        })
    })
 
})

export const {useGetPrivacyQuery,useGetTermsAndConditionsQuery,useGetTrustSafetyQuery} = getInfo;