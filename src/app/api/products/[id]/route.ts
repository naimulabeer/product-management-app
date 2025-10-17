import { authHeaders, passThrough, UPSTREAM } from "../../_utils/proxy"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}))
  const res = await fetch(`${UPSTREAM}/products/${params.id}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  })
  return passThrough(res)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${UPSTREAM}/products/${params.id}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  })
  return passThrough(res)
}
