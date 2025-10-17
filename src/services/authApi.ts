import { api } from "@/services/api";
type AuthRequest = { email: string };
type AuthResponse = { token: string };

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, AuthRequest>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
