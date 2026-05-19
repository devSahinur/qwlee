import { baseApi } from "../api/baseApi";

const AddGigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AddGig: builder.mutation({
      query: (data) => {
        return {
          url: `/gig`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Gigs"],
    }),
  }),
});

export const { useAddGigMutation } = AddGigApi;
