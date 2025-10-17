import { NextRequest } from "next/server"
import { authHeaders, passThrough, UPSTREAM } from "../../_utils/proxy"

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams
  const searchedText = sp.get("searchedText") || ""
  const url = `${UPSTREAM}/products/search?searchedText=${encodeURIComponent(searchedText)}`
  const res = await fetch(url, { method: "GET", headers: await authHeaders(), cache: "no-store" })
  return passThrough(res)
}
