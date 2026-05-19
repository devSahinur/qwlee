import { baseApi } from "../api/baseApi";

const deleteGigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteGig: builder.mutation({
      query: (id) => {
        return {
          url: `/gig/${id}`,
          method: "DELETE",
          //   body: data,
        };
      },
      invalidatesTags: ["Gigs"],
    }),
  }),
});

export const { useDeleteGigMutation } = deleteGigApi;
