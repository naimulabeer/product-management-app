import { authHeaders, passThrough, UPSTREAM } from "../../../_utils/proxy"

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const res = await fetch(`${UPSTREAM}/products/${params.slug}`, {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  return passThrough(res)
}
