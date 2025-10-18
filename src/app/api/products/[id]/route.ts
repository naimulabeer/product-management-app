import type { NextRequest } from "next/server"
import { authHeaders, passThrough, UPSTREAM } from "../../_utils/proxy"

// PUT /api/products/:id
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params                   // 👈 await the params
  const body = await req.json().catch(() => ({}))

  const res = await fetch(`${UPSTREAM}/products/${id}`, {
    method: "PUT",
    headers: await authHeaders(),                              // 👈 no await
    body: JSON.stringify(body),
    cache: "no-store",
  })
  return passThrough(res)
}

// DELETE /api/products/:id
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params                   // 👈 await the params

  const res = await fetch(`${UPSTREAM}/products/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  })
  return passThrough(res)
}
