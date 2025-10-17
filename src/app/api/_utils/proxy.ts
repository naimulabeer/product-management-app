import { cookies } from "next/headers"

export const UPSTREAM = "https://api.bitechx.com"

export async function authHeaders(extra?: Record<string, string>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("pma_token")?.value;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extra ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function passThrough(res: Response) {
  const text = await res.text()
  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "x-proxy-upstream": res.url || UPSTREAM,
      "x-proxy-status": String(res.status),
    },
  })
}
