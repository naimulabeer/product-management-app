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
const proxied = (u: string) => `/api/image?url=${encodeURIComponent(u)}`

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
    <div className="mx-auto max-w-4xl p-4 space-y-4">
      <Card className="border-ink/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-ink">{data.name}</CardTitle>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/products/${data.slug}/edit`}>Edit</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
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
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-ink/80">
            {data.description ?? "No description"}
          </div>
          <div className="text-sm text-ink/70">
            Category: {data.category?.name ?? "-"}
          </div>
          <div className="text-sm">Price: {Number(data?.price).toFixed(2)}</div>
          // later in images section:
          <div className="flex flex-wrap gap-3 mt-2">
            {data.images?.map((src) => (
              <Image
                key={src}
                src={proxied(src)}
                alt={data.name}
                width={112} // 7rem
                height={112}
                className="h-28 w-28 object-cover rounded-lg border"
              />
            ))}
          </div>
          <div className="text-xs text-ink/60">
            Created: {new Date(data.createdAt).toLocaleString()} · Updated:{" "}
            {new Date(data.updatedAt).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
