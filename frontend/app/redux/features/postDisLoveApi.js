import { baseApi } from "../api/baseApi";

const postDisLoveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postDisLove: builder.mutation({
      query: (id) => {
        return {
          url: `/gig/love?gigId=${id}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["ReactLove"],
    }),
  }),
});

export const { usePostDisLoveMutation } = postDisLoveApi;