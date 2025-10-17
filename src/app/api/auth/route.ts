export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!body?.email) {
    return new Response(JSON.stringify({ message: "email required" }), { status: 400 })
  }

  // forward to the remote API
  const res = await fetch("https://api.bitechx.com/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email }),
  })

  // pass-through status and body
  const text = await res.text()
  return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
}
