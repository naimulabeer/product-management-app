"use client";

import {
  useGetProductBySlugQuery,
  useDeleteProductMutation,
} from "@/services/productsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { extractApiError } from "@/lib/apiError";
import Image from "next/image";
const proxied = (u: string) => `/api/image?url=${encodeURIComponent(u)}`;

export default function ProductDetailsClient({ slug }: { slug: string }) {
  const { data, isFetching, isError, error, refetch } =
    useGetProductBySlugQuery(slug);
  const [del, delState] = useDeleteProductMutation();
  const router = useRouter();

  const onDelete = async () => {
    if (!data?.id) return;
    await del(data.id).unwrap();
    router.replace("/products");
  };

  if (isFetching && !data) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading…</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-clay">Couldn’t load product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink/70 mb-3">{extractApiError(error)}</p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      {/* Header / Title */}
      <div className="rounded-3xl border border-ink/10 bg-gradient-to-br from-white to-mist p-5 md:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
              {data.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {/* Category pill */}
              <span className="inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs text-ink/70">
                {data.category?.name ?? "Uncategorized"}
              </span>
              {/* Price chip */}
              <span className="inline-flex items-center rounded-full bg-pine px-3 py-1 text-xs font-medium text-white">
                {Number(data.price).toFixed(2)} ৳
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/products/${data.slug}/edit`}>Edit</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-xl">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{data.name}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    API simulates delete (200 if id valid). Continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={delState.isLoading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={delState.isLoading}
                  >
                    {delState.isLoading ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Media + Details */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Images */}
        <div className="md:col-span-3">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
            {/* Hero image */}
            <div className="relative w-full  aspect-[16/10]">
              <Image
                src={proxied(
                  data.images?.[0] ?? "https://i.imgur.com/QkIa5tT.jpeg"
                )}
                alt={data.name}
                fill
                className="object-cover p-4"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>

            {/* Thumbnails */}
            {data.images?.length ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 md:p-4 bg-mist/50">
                {data.images.map((src) => (
                  <div
                    key={src}
                    className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-ink/10 bg-white"
                  >
                    <Image
                      src={proxied(src)}
                      alt={data.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 15vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Textual details */}
        <div className="md:col-span-2 space-y-4">
          {/* Description card */}
          <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-base font-semibold text-ink">
              Description
            </h2>
            <p className="prose prose-sm max-w-none leading-relaxed text-ink/80">
              {data.description ?? "No description provided for this product."}
            </p>
          </div>

          {/* Meta / timestamps */}
          <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-ink">Details</h3>
            <dl className="grid grid-cols-1 gap-2 text-sm text-ink/70">
              <div className="flex items-center justify-between">
                <dt>Created</dt>
                <dd className="font-medium text-ink">
                  {new Date(data.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Updated</dt>
                <dd className="font-medium text-ink">
                  {new Date(data.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick actions (mobile-friendly duplicate) */}
          <div className="flex md:hidden items-center gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/products/${data.slug}/edit`}>Edit</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-xl">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{data.name}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    API simulates delete (200 if id valid). Continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={delState.isLoading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={delState.isLoading}
                  >
                    {delState.isLoading ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
