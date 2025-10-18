import { z } from "zod"

export const urlStr = z.string().url("Must be a valid URL")

export const productCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  images: z.array(urlStr).min(1, "At least one image URL is required"),
  price: z.coerce.number({ message: "Price must be a number" })
    .positive("Price must be greater than 0"),
  categoryId: z.string().uuid("Category ID must be a valid UUID"),
})

export const productUpdateSchema = productCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update" }
)


export type ProductCreateForm = z.input<typeof productCreateSchema>
export type ProductCreateData = z.output<typeof productCreateSchema>

export type ProductUpdateForm = z.input<typeof productUpdateSchema>
export type ProductUpdateData = z.output<typeof productUpdateSchema>
