"use client"

import { Button } from "@/components/ui/button"

export default function ProductsPagination({
  page, showPrev, showNext, onPrev, onNext, disabled,
  count, total, limit,
}: {
  page: number
  showPrev: boolean
  showNext: boolean
  onPrev: () => void
  onNext: () => void
  disabled?: boolean
  /** number of items on the current page */
  count?: number
  /** total items across all pages (optional; if provided with limit, we show "of Y") */
  total?: number
  /** page size (optional; used with total to compute total pages) */
  limit?: number
}) {
  const totalPages =
    typeof total === "number" && typeof limit === "number" && limit > 0
      ? Math.max(1, Math.ceil(total / limit))
      : undefined

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-ink/70">
        Page {page}{totalPages ? ` of ${totalPages}` : ""}{typeof count === "number" ? ` — ${count} item${count === 1 ? "" : "s"}` : ""}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={!showPrev || !!disabled} onClick={onPrev}>Prev</Button>
        <Button variant="outline" disabled={!showNext || !!disabled} onClick={onNext}>Next</Button>
      </div>
    </div>
  )
}
