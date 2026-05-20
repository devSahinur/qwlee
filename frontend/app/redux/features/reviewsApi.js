// Review mutations + the order-scoped lookup. The list query lives in
// getAllReviewApi.js — keep both so the gig details page reads through
// the original hook (and its cache) while the order page + composer
// here both invalidate the same `GigReviews` tag.

import { baseApi } from "../api/baseApi";

const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: ({ orderId, rating, review }) => ({
        url: "/reviews",
        method: "POST",
        body: { orderId, rating, review },
      }),
      invalidatesTags: ["GigReviews"],
    }),
    getReviewByOrder: builder.query({
      query: (orderId) => ({
        url: `/reviews/by-order/${orderId}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data?.attributes || null,
      providesTags: (_r, _e, orderId) => [{ type: "GigReviews", id: orderId }],
    }),
    replyToReview: builder.mutation({
      query: ({ reviewId, message }) => ({
        url: `/reviews/${reviewId}/reply`,
        method: "PATCH",
        body: { message },
      }),
      invalidatesTags: ["GigReviews"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewByOrderQuery,
  useReplyToReviewMutation,
} = reviewsApi;
