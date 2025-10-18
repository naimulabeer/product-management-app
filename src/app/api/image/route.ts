import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url")
  if (!urlParam) {
    return new Response("Missing url", { status: 400 })
  }

  try {
    // Basic safety: only allow https and limit length
    const parsed = new URL(urlParam)
    if (parsed.protocol !== "https:") {
      return new Response("Only https is allowed", { status: 400 })
    }
    if (urlParam.length > 2000) {
      return new Response("URL too long", { status: 400 })
    }

    const upstream = await fetch(parsed.toString(), { cache: "no-store" })
    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, { status: 502 })
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg"
    // Stream the body back
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // 1 day CDN cache, revalidate in background if you deploy on Vercel
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    })
  } catch (e) {
    return new Response("Bad url", { status: 400 })
  }
}
