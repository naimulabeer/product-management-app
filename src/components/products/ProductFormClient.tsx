"use client";

import { useGetCategoriesQuery } from "@/services/categoriesApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateForm,
  type ProductCreateData,
  type ProductUpdateForm,
  type ProductUpdateData,
} from "@/features/products/schemas";
import {
  useCreateProductMutation,
  useGetProductBySlugQuery,
  useUpdateProductMutation,
} from "@/services/productsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/apiError";

type Props =
  | { mode: "create"; slug?: undefined }
  | { mode: "edit"; slug: string };

export default function ProductFormClient(props: Props) {
  const catsQ = useGetCategoriesQuery({ offset: 0, limit: 100 });
  const router = useRouter();
  const isEdit = props.mode === "edit";

  const productQ = useGetProductBySlugQuery(props.slug!, { skip: !isEdit });
  const [createProduct, createState] = useCreateProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();

  
  const createForm = useForm<ProductCreateForm>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [""],
      price: 0,
      categoryId: "",
    },
    mode: "onChange",
  });

  const updateForm = useForm<ProductUpdateForm>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: { images: [""], categoryId: "" },
    mode: "onChange",
  });

  const form = isEdit ? updateForm : createForm;

  
  const { fields, append, remove } = useFieldArray({
    control: form.control as any,
    name: "images",
  });

  
  useEffect(() => {
    if (isEdit && productQ.data) {
      updateForm.reset({
        name: productQ.data.name,
        description: productQ.data.description ?? "",
        images: productQ.data.images?.length ? productQ.data.images : [""],
        // price input accepts string/number; give number (coerces fine)
        price: productQ.data.price as any,
        categoryId: productQ.data.category?.id ?? "",
      });
    }
    
  }, [isEdit, productQ.data]);

  // errors
  const errors = form.formState.errors;

  // API error message (no any)
  const requestError =
    (createState.isError && extractApiError(createState.error)) ||
    (updateState.isError && extractApiError(updateState.error)) ||
    "";

  // submit (no any)
  const onSubmit = async (values: ProductCreateForm | ProductUpdateForm) => {
    try {
      if (isEdit) {
        const id = productQ.data?.id;
        if (!id) return;
        const parsed = productUpdateSchema.parse(values);
        const res = await updateProduct({ id, data: parsed }).unwrap();
        router.replace(`/products/${res.slug}`);
      } else {
        const parsed = productCreateSchema.parse(values);
        const res = await createProduct(parsed).unwrap();
        router.replace(`/products/${res.slug}`);
      }
    } catch {
      /* handled via requestError */
    }
  };

  if (isEdit && productQ.isFetching && !productQ.data) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEdit && productQ.isError) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-clay">Couldn’t load product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink/70">
              {(productQ.error as any)?.data?.message ?? "Unknown error"}
            </p>
            <Button variant="outline" onClick={() => productQ.refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const busy = createState.isLoading || updateState.isLoading;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card className="border-ink/10">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Product" : "Create Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Product name"
                {...form.register("name")}
              />
              <p className="text-sm text-clay">
                {errors.name?.message as string}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product"
                {...form.register("description")}
              />
              <p className="text-sm text-clay">
                {errors.description?.message as string}
              </p>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Images (URLs)</Label>
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      placeholder="https://…"
                      {...form.register(`images.${idx}`)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append("")}
                >
                  Add image
                </Button>
              </div>
              <p className="text-sm text-clay">
                {(errors.images as any)?.message}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("price")}
              />
              <p className="text-sm text-clay">
                {errors.price?.message as string}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>

              {catsQ.isFetching && (
                <div className="text-sm text-ink/70">Loading categories…</div>
              )}
              {catsQ.isError && (
                <div className="text-sm text-clay">
                  Failed to load categories
                </div>
              )}

              {!catsQ.isFetching && catsQ.data && (
                <Controller
                  control={form.control as any}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""} // "" shows placeholder; no item has empty value
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {catsQ.data?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </div>

            {(createState.isError || updateState.isError) && (
              <div className="text-sm text-clay">
                {(createState.error as any)?.data?.message ||
                  (updateState.error as any)?.data?.message ||
                  "Request failed"}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={busy}>
                {busy
                  ? isEdit
                    ? "Saving…"
                    : "Creating…"
                  : isEdit
                  ? "Save changes"
                  : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={busy}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
