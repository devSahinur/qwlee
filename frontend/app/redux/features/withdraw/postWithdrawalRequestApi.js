import { baseApi } from "../../api/baseApi";

const postWithdrawalRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postWithdrawalRequest: builder.mutation({
      query: (withdrawalRequest) => ({
        url: "/withdrawal",
        method: "POST",
        body: withdrawalRequest,
      }),
      invalidatesTags: ["Withdraw", "SingeUser"],
    }),
    getMyWithdrawalRequest: builder.query({
      query: () => ({
        url: "/withdrawal/my",
      }),
      providesTags: ["Withdraw"],
    }),
  }),
});

export const {
  usePostWithdrawalRequestMutation,
  useGetMyWithdrawalRequestQuery,
} = postWithdrawalRequestApi;
