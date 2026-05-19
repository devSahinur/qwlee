import { baseApi } from "../api/baseApi";

const updateProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfileImage: builder.mutation({
      query: (data) => ({
        url: `/users/profile-image`,
        method: "POST",
        body: data,
      }),
    }),
    updateCoverImage: builder.mutation({
      query: (data) => ({
        url: `/users/cover-image`,
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => {
        return {
          url: `users/profile`,
          method: "POST",

          body: data,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useUpdateCoverImageMutation,
} = updateProfileApi;
