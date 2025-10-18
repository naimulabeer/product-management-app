"use client";

import { useGetCategoriesQuery } from "@/services/categoriesApi";

import { useEffect, useMemo, useState } from "react";
import {
  useGetProductsQuery,
  useSearchProductsQuery,
} from "@/services/productsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductsTable from "./ProductsTable";
import ProductsPagination from "./ProductsPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ProductsShell() {
  // state
  const [categoryId, setCategoryId] = useState<string>(""); // empty string = "all"
  const sentinelAll = "__all__";
  const catsQ = useGetCategoriesQuery({ offset: 0, limit: 100 });
  const [q, setQ] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  // debounce search text
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  // when searching, we use the search endpoint (no pagination API provided); otherwise list with offset/limit
  const searching = debouncedQ.trim().length > 0;

  const searchQuery = useSearchProductsQuery(
    searching ? { searchedText: debouncedQ } : { searchedText: "" },
    { skip: !searching }
  );

  const listQuery = useGetProductsQuery(
    searching
      ? undefined
      : { offset, limit, categoryId: categoryId || undefined }
  );

  const items = searching ? searchQuery.data ?? [] : listQuery.data ?? [];
  const loading = searching
    ? searchQuery.isFetching && !searchQuery.data
    : listQuery.isFetching && !listQuery.data;
  const errorMsg = searching
    ? searchQuery.isError
      ? (searchQuery.error as any)?.data?.message || "Search failed"
      : null
    : listQuery.isError
    ? (listQuery.error as any)?.data?.message || "Failed to load products"
    : null;

  // basic next/prev availability: upstream doesn’t return total, so we allow next if page is "full"
  const canNext = !searching && (listQuery.data?.length ?? 0) === limit;
  const onNext = () => setOffset((o) => o + limit);
  const onPrev = () => setOffset((o) => Math.max(0, o - limit));
  useEffect(() => {
    setOffset(0);
  }, [debouncedQ]); // reset when switching search mode

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card className="border-ink/10">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-ink">Products</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-56"
            />
            <Button asChild>
              <Link href="/products/new">Add Product</Link>
            </Button>
          </div>
        </CardHeader>

        {!catsQ.isError && catsQ.data && (
          <Select
            value={categoryId || sentinelAll}
            onValueChange={(v) => {
              setCategoryId(v === sentinelAll ? "" : v);
              setOffset(0);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={sentinelAll}>All categories</SelectItem>{" "}
              {/* ✅ non-empty */}
              {catsQ.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <CardContent className="space-y-4">
          <ProductsTable
            data={items}
            loading={!!loading}
            error={errorMsg}
            onRetry={() =>
              searching ? searchQuery.refetch() : listQuery.refetch()
            }
          />

          {!searching && (
            <ProductsPagination
              page={Math.floor(offset / limit) + 1}
              showNext={canNext}
              showPrev={offset > 0}
              onNext={onNext}
              onPrev={onPrev}
              disabled={listQuery.isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
