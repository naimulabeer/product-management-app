import { api } from "@/services/api"
import type { Category } from "@/types/category"

export type CatListParams = { offset?: number; limit?: number }
export type CatSearchParams = { searchedText: string }

export const categoriesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], CatListParams | void>({
      query: (params) => ({ url: "/categories", params: params || undefined }),
      providesTags: (result) => [
        { type: "Products" as const, id: "CATS" },
        ...(result ?? []).map((c) => ({ type: "Product" as const, id: `cat:${c.id}` })),
      ],
      keepUnusedDataFor: 60,
    }),
    searchCategories: build.query<Category[], CatSearchParams>({
      query: ({ searchedText }) => ({ url: "/categories/search", params: { searchedText } }),
    }),
  }),
})

export const { useGetCategoriesQuery, useSearchCategoriesQuery } = categoriesApi
