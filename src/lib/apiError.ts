import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export function extractApiError(err: unknown): string {
  // RTK Query error shape
  if (typeof err === "object" && err !== null && "status" in err) {
    const e = err as FetchBaseQueryError
    if ("data" in e && e.data && typeof e.data === "object" && "message" in (e.data)) {
      return String((e.data).message)
    }
    return `HTTP ${String(e.status)}`
  }
  if (err instanceof Error) return err.message
  return "Unknown error"
}
