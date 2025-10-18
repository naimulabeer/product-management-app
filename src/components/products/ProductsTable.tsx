"use client"

import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import ConfirmDelete from "./ConfirmDelete"

export default function ProductsTable({
  data,
  loading,
  error,
  onRetry,
}: {
  data: Product[]
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-ink/10 bg-white p-4 md:p-0 md:border-0">
            {/* mobile skeleton */}
            <div className="flex flex-col gap-2 md:hidden">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
            {/* desktop skeleton */}
            <div className="hidden md:grid md:grid-cols-[2fr,1fr,1fr,1fr] md:items-center md:gap-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-white p-4 border border-clay/30 text-clay">
        <div className="font-semibold">Couldn’t load products</div>
        <div className="text-sm opacity-90">{error}</div>
        <Button variant="outline" className="mt-3" onClick={onRetry}>Retry</Button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md bg-white p-8 border border-ink/10 text-pine text-center">
        No products found.
      </div>
    )
  }

  return (
    <div className="rounded-md border border-ink/10 overflow-hidden">
      {/* Header: desktop only */}
      <div className="hidden md:grid md:grid-cols-[2fr,1fr,1fr,1fr] bg-white px-4 py-3 text-sm font-medium text-ink/70">
        <div>Name</div>
        <div>Category</div>
        <div>Price</div>
        <div>Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-ink/10 bg-white">
        {data.map((p) => (
          <div
            key={p.id}
            className="
              p-4
              md:px-4 md:py-3
              grid gap-3
              md:grid-cols-[2fr,1fr,1fr,1fr]
              md:items-center
            "
          >
            {/* Name */}
            <div>
              <div className="md:hidden text-[11px] uppercase tracking-wide text-ink/50 mb-1">Name</div>
              <div className="font-semibold text-ink line-clamp-2 md:line-clamp-1">{p.name}</div>
            </div>

            {/* Category */}
            <div>
              <div className="md:hidden text-[11px] uppercase tracking-wide text-ink/50 mb-1">Category</div>
              <div className="text-sm text-ink/70">{p.category?.name ?? "-"}</div>
            </div>

            {/* Price */}
            <div>
              <div className="md:hidden text-[11px] uppercase tracking-wide text-ink/50 mb-1">Price</div>
              <div className="text-sm">${Number(p.price).toFixed(2)}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:justify-end">
              {/* Mobile: full width; Desktop: compact */}
              <Button asChild variant="outline" size="sm" className="md:w-auto w-full">
                <Link href={`/products/${p.slug}`}>Details</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="md:w-auto w-full">
                <Link href={`/products/${p.slug}/edit`}>Edit</Link>
              </Button>
              <div className="md:w-auto w-full">
                <ConfirmDelete id={p.id} name={p.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
