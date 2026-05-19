const { baseApi } = require("../api/baseApi");

const getNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => ({
        url: "/notification",
        method: "GET",
      }),
      transformResponse: (data) => data?.data?.attributes,
      providesTags: ["Notifications"],
    }),

    // Backend route is POST /v1/notification/:id (not PATCH — sending
    // the wrong verb silently 404'd, which is why marking read used to
    // look like it never worked).
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}`,
        method: "POST",
      }),
      // Optimistic update — decrement unread + flip the row immediately
      // so the badge doesn't lag a network round-trip.
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          getNotificationApi.util.updateQueryData(
            "getNotification",
            undefined,
            (draft) => {
              if (!draft?.results) return;
              const row = draft.results.find((n) => n._id === notificationId);
              if (row && !row.viewStatus) {
                row.viewStatus = true;
                if (typeof draft.unReadCount === "number") {
                  draft.unReadCount = Math.max(0, draft.unReadCount - 1);
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `/notification/read-all`,
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        // Optimistic: flip every unread row in the cache instantly so
        // the badge drops to zero on click.
        const patch = dispatch(
          getNotificationApi.util.updateQueryData(
            "getNotification",
            undefined,
            (draft) => {
              if (!draft?.results) return;
              for (const n of draft.results) n.viewStatus = true;
              draft.unReadCount = 0;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = getNotificationApi;

export { getNotificationApi };
