import { NextRequest } from "next/server"
import { UPSTREAM, authHeaders, passThrough } from "../_utils/proxy"

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams
  const qs = sp.toString()
  const url = `${UPSTREAM}/products${qs ? `?${qs}` : ""}`
  const res = await fetch(url, { method: "GET", headers: await authHeaders(), cache: "no-store" })
  return passThrough(res)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const res = await fetch(`${UPSTREAM}/products`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  })
  return passThrough(res)
}
