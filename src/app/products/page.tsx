import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProductsShell from "@/components/products/ProductsShell"

export default async function ProductsPage() {
  const token = (await cookies()).get("pma_token")?.value
  if (!token) redirect("/login")
  return <ProductsShell />
}
