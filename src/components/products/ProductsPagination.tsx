"use client"

import { Button } from "@/components/ui/button"

export default function ProductsPagination({
  page, showPrev, showNext, onPrev, onNext, disabled,
}: {
  page: number
  showPrev: boolean
  showNext: boolean
  onPrev: () => void
  onNext: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-ink/70">
        Page {page}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={!showPrev || !!disabled} onClick={onPrev}>Prev</Button>
        <Button variant="outline" disabled={!showNext || !!disabled} onClick={onNext}>Next</Button>
      </div>
    </div>
  )
}
