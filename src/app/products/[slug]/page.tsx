import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ProductDetailsClient from "@/components/products/ProductsDetailsClient";

export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const token = (await cookies()).get("pma_token")?.value;
  if (!token) redirect("/login");
  return <ProductDetailsClient slug={params.slug} />;
}
