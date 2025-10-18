import ProductFormClient from "@/components/products/ProductFormClient"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  const token = (await cookies()).get("pma_token")?.value
  if (!token) redirect("/login")
  return <ProductFormClient mode="edit" slug={params.slug} />
}
