import { z } from "zod";
import { AvailabilityStatus } from "@/app/types/index";

/* ================================
 ✅  Generic string list
================================= */
const stringArrayField = z.array(z.string().min(1)).default([]);

/* ================================
 ✅  Option objects
================================= */
export const materialOption = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  status: z.nativeEnum(AvailabilityStatus),
});

export const finishOption = z.object({
  colorName: z.string().min(1),
  hexCode: z.string().optional(),
  status: z.nativeEnum(AvailabilityStatus),
});

export const editionOption = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const luxuryFeatureOption = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

/* ================================
 ✅  Product Schema
================================= */

export const productFormSchema = z
  .object({
    name: z.string().min(3, "Product name is too short."),
    description: z.string().min(10, "Description is too short."),
    pricing: z.coerce.number().positive(),
    category: z.string().min(1, "Category is required."),
    stockQuantity: z.coerce.number().int().min(0),
    availabilityStatus: z.nativeEnum(AvailabilityStatus),
    collectionId: z.string().min(1, "Collection is required."),
    discount: z.coerce.number().min(0).max(100).default(0),

    images: z
      .array(z.union([z.instanceof(File), z.string()]))
      .min(1, "At least one image is required."),

    features: stringArrayField,
    specifications: stringArrayField,

    luxuryFeatures: z.array(luxuryFeatureOption).default([]),
    editions: z.array(editionOption).default([]),
    materialOptions: z.array(materialOption).default([]),
    finishOptions: z.array(finishOption).default([]),
  })
  .strict();

/* ================================
 ✅ Types
================================= */

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormOutput = z.output<typeof productFormSchema>;

/* ================================
 ✅ useFieldArray name helpers
================================= */

export const arrayFieldNames = [
  "features",
  "specifications",
  "luxuryFeatures",
  "editions",
  "materialOptions",
  "finishOptions",
] as const;

export type ArrayFieldNames = (typeof arrayFieldNames)[number];

export type StringArrayFieldNames =
  | "features"
  | "specifications"
  | "luxuryFeatures"
  | "editions";

export type ObjectArrayFieldNames = "materialOptions" | "finishOptions";
