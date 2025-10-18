import type { NextRequest } from "next/server"
import { authHeaders, passThrough, UPSTREAM } from "../../../_utils/proxy"


export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params                 // 👈 await the params

  const res = await fetch(`${UPSTREAM}/products/${slug}`, {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  })
  return passThrough(res)
}
