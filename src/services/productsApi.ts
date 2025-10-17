import { api } from "@/services/api"
import type { Product } from "@/types/product"

export type ListParams = { offset?: number; limit?: number; categoryId?: string }
export type CreatePayload = {
  name: string
  description?: string
  images: string[]
  price: number
  categoryId: string
}
export type UpdatePayload = Partial<Pick<CreatePayload, "name" | "description" | "images" | "price" | "categoryId">>

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], ListParams | void>({
      query: (params) => (params ? { url: "/products", params } : "/products"),
      providesTags: (result) => [
        { type: "Products" as const, id: "LIST" },
        ...(result ?? []).map((p) => ({ type: "Product" as const, id: p.id })),
      ],
      keepUnusedDataFor: 60,
    }),

    searchProducts: build.query<Product[], { searchedText: string }>({
      query: ({ searchedText }) => ({ url: "/products/search", params: { searchedText } }),
      providesTags: (result) => [
        { type: "Products" as const, id: "SEARCH" },
        ...(result ?? []).map((p) => ({ type: "Product" as const, id: p.id })),
      ],
    }),

    getProductBySlug: build.query<Product, string>({
      query: (slug) => `/products/by-slug/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: "Product", id: `slug:${slug}` }],
    }),

    createProduct: build.mutation<Product, CreatePayload>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Products", id: "LIST" }, { type: "Products", id: "SEARCH" }],
    }),

    updateProduct: build.mutation<Product, { id: string; data: UpdatePayload }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
        { type: "Products", id: "SEARCH" },
      ],
    }),

    deleteProduct: build.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
        { type: "Products", id: "SEARCH" },
      ],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
