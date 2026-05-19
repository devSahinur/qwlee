import { baseApi } from "../api/baseApi";

const getAllUsers = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();
        if (search) params.set("fullName", search);
        if (page) params.set("page", page);
        if (limit) params.set("limit", limit);
        return {
          url: `/users?role=freelancer`,
          method: "GET",
          params: params,
          transformResponse: (data) => data.users,
        };
      },
    }),
  }),
});

export const { useGetAllUsersQuery } = getAllUsers;
