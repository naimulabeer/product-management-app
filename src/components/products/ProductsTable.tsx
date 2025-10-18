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
          <div key={i} className="grid grid-cols-[2fr,1fr,1fr,auto] items-center gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-40" />
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
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr] self-start bg-white px-4 py-3 text-sm font-medium text-ink/70">
        <div>Name</div>
        <div>Category</div>
        <div>Price</div>
        <div>Actions</div>
      </div>

      <div className="divide-y divide-ink/10 bg-white">
        {data.map((p) => (
          <div key={p.id} className="grid grid-cols-[2fr,1fr,1fr,1fr] self-start items-start px-4 py-3 gap-3">
            <div className="font-medium line-clamp-1">{p.name}</div>
            <div className="text-sm text-ink/70">{p.category?.name ?? "-"}</div>
            <div className="text-sm">{Number(p.price).toFixed(2)}</div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/products/${p.slug}`}>Details</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/products/${p.slug}/edit`}>Edit</Link>
              </Button>
              <ConfirmDelete id={p.id} name={p.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
