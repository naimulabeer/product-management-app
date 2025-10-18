import ProductFormClient from "@/components/products/ProductFormClient"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function NewProductPage() {
  const token = (await cookies()).get("pma_token")?.value
  if (!token) redirect("/login")
  return <ProductFormClient mode="create" />
}
