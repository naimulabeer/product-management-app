import { cookies } from "next/headers"

export async function POST(request: Request) {
  const { token, email } = await request.json()
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), { status: 400 })
  }
  const c = await cookies()
  c.set("pma_token", token, {
    httpOnly: false,          // simple for demo; set true if you’ll avoid reading it client-side
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 3, // 3 days
  })
  c.set("pma_email", email ?? "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 3,
  })
  return new Response(JSON.stringify({ ok: true }))
}

export async function DELETE() {
  const c = await cookies()
  c.delete("pma_token")
  c.delete("pma_email")
  return new Response(JSON.stringify({ ok: true }))
}
