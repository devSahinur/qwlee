const { baseApi } = require("../api/baseApi");

const getBannerImages = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBannerImages: builder.query({
            query: () => ({
                url: "/banner-image",
                method: "GET"
            }),
            transformResponse: (data) => data?.data?.attributes?.results,
        })
    })
})
export const {useGetBannerImagesQuery} = getBannerImages;