import { baseApi } from "../api/baseApi";

const postOtpVerifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postOtpVerify: builder.mutation({
      query: (data) => {
        return {
          url: `/auth/verify-email`,
          method: "POST",
          body: data,
        };
      },
      // invalidatesTags: ["Portfolio"],
    }),
  }),
});

export const { usePostOtpVerifyMutation } = postOtpVerifyApi;
