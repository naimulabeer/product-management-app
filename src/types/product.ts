export type Category = {
  id: string
  name: string
  image: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export type Product = {
  id: string
  name: string
  description?: string | null
  images: string[]
  price: number
  slug: string
  createdAt: string
  updatedAt: string
  category: Category
}
