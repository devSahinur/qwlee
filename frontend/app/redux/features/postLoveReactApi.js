import { baseApi } from "../api/baseApi";

const postLoveReactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postLoveReact: builder.mutation({
      query: (id) => {
        return {
          url: `/gig/love?gigId=${id}`,
          method: "POST",
        };
      },
      invalidatesTags: ["ReactLove"],
    }),
  }),
});

export const { usePostLoveReactMutation } = postLoveReactApi;