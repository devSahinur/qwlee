// RTK Query slice for seller verification (NID / passport).

import { baseApi } from "../api/baseApi";

const verificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitVerification: builder.mutation({
      // payload is a FormData with: documentType, documentNumber,
      // front, back (optional), selfie.
      query: (formData) => ({
        url: "/verification/submit",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSubmitVerificationMutation } = verificationApi;
