import { baseApi } from "../api/baseApi";

const editGigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    editGig: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `gig/${id}`,
          method: "PATCH",

          body: data,
        };
      },
      invalidatesTags: ["Gigs", "updateGig"],
    }),
  }),
});

export const { useEditGigMutation } = editGigApi;
