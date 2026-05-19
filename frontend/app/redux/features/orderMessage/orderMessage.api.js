const { baseApi } = require("../../api/baseApi");

const oderMessage = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendOrderMessage: builder.mutation({
      query: (message) => ({
        url: "/order-message",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["OrderMessages"],
    }),
    getOrderMessage: builder.query({
      query: (orderId) => ({
        url: `/order-message?orderId=${orderId}`,
        method: "GET",
      }),
      providesTags: ["OrderMessages"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useSendOrderMessageMutation, useGetOrderMessageQuery } = oderMessage;
