const { baseApi } = require("../api/baseApi");

const postResetPassword = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postResetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostResetPasswordMutation } = postResetPassword;
