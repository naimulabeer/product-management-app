import { NextRequest } from "next/server"
import { authHeaders, passThrough, UPSTREAM } from "../_utils/proxy"

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams
  const qs = sp.toString()
  const url = `${UPSTREAM}/categories${qs ? `?${qs}` : ""}`
  const res = await fetch(url, { method: "GET", headers: await authHeaders(), cache: "no-store" })
  return passThrough(res)
}
