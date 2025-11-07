"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  type Resolver,
} from "react-hook-form";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "../../../shared/ImageUploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { AvailabilityStatus } from "../../../../lib/definitions";
import {
  fetchCollections,
  uploadImageToCloudinary,
  createProduct,
} from "@/lib/ProductApi";

/* ---------------- ZOD SCHEMA ---------------- */
const productFormSchema = z.object({
  name: z.string().min(3, "Product name is too short."),
  slug: z.string().min(3, "Slug is required."),
  description: z.string().min(10, "Description is too short."),
  pricing: z.coerce.number().positive(),
  category: z.string().min(1, "Category is required."),
  stockQuantity: z.coerce.number().int().min(0),
  availabilityStatus: z.nativeEnum(AvailabilityStatus),
  collectionId: z.string().min(1, "Collection is required."),
  discount: z.coerce.number().min(0).max(100).default(0),
  experience: z.string().min(3, "Experience is required."),
  images: z.array(z.union([z.string(), z.instanceof(File)])),

  features: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      Array.isArray(val)
        ? val
        : (val ?? "")
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
    ),

  specifications: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      Array.isArray(val)
        ? val
        : (val ?? "")
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
    ),

  luxuryFeatures: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      Array.isArray(val)
        ? val
        : (val ?? "")
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
    ),

  editions: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) =>
      Array.isArray(val)
        ? val
        : (val ?? "")
            .toString()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
    ),

  materialOptions: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.coerce.number().positive(),
        status: z.nativeEnum(AvailabilityStatus),
      })
    )
    .default([]),

  finishOptions: z
    .array(
      z.object({
        colorName: z.string().min(1),
        hexCode: z.string().optional(),
        status: z.nativeEnum(AvailabilityStatus),
      })
    )
    .default([]),
});

type ProductFormInput = z.input<typeof productFormSchema>;
type ProductFormOutput = z.output<typeof productFormSchema>;

/* ---------------- COMPONENT ---------------- */
export function ProductForm() {
  const resolver = zodResolver(
    productFormSchema
  ) as unknown as Resolver<ProductFormInput>;

  const form = useForm<ProductFormInput>({
    resolver,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      pricing: 0,
      category: "",
      stockQuantity: 0,
      availabilityStatus: AvailabilityStatus.COMING_SOON,
      collectionId: "",
      discount: 0,
      experience: "",
      images: [],
      features: "",
      specifications: "",
      luxuryFeatures: "",
      editions: "",
      materialOptions: [],
      finishOptions: [],
    },
  });

  const {
    data: collections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductFormOutput) => {
      const imageFiles = values.images.filter(
        (img): img is File => img instanceof File
      );
      const existingImageUrls = values.images.filter(
        (img): img is string => typeof img === "string"
      );

      const uploadedUrls = await Promise.all(
        imageFiles.map((file) => uploadImageToCloudinary(file))
      );
      const allImageUrls = [...existingImageUrls, ...uploadedUrls];

      return createProduct({ ...values, images: allImageUrls });
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create product", { description: error.message });
    },
  });

  const onSubmit: SubmitHandler<ProductFormInput> = (values) => {
    const parsed = productFormSchema.parse(values);
    mutate(parsed);
  };

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({ control: form.control, name: "materialOptions" });

  const {
    fields: finishFields,
    append: appendFinish,
    remove: removeFinish,
  } = useFieldArray({ control: form.control, name: "finishOptions" });

  const selectedCollectionId = form.watch("collectionId");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* --- Collection Selector --- */}
        <FormField
          control={form.control}
          name="collectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {error && (
                    <p className="p-2 text-sm text-destructive">
                      Failed to load collections.
                    </p>
                  )}
                  {collections?.map((col: { _id: string; name: string }) => (
                    <SelectItem key={col._id} value={col._id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCollectionId && (
          <>
            <Separator />

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Aurora Dining Table" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="unique-product-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe the user experience..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the product..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing / Stock / Discount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["pricing", "stockQuantity", "discount"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof ProductFormInput}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {name === "pricing"
                          ? "Price (USD)"
                          : name === "stockQuantity"
                          ? "Stock Quantity"
                          : "Discount (%)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={String(field.value ?? "")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Category / Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Tables">Tables</SelectItem>
                        <SelectItem value="Seating">Seating</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availabilityStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(AvailabilityStatus).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Textarea fields */}
            {["features", "specifications", "luxuryFeatures", "editions"].map(
              (name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof ProductFormInput}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {name
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Enter ${name} separated by commas`}
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : Array.isArray(field.value)
                              ? field.value.join(", ")
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}

            <Separator />

            {/* Material Options */}
            <div>
              <h3 className="text-lg font-medium mb-4">Material Options</h3>
              {materialFields.map((mf, idx) => (
                <div
                  key={mf.id}
                  className="grid grid-cols-4 gap-4 border p-4 rounded-lg mb-4 relative"
                >
                  <FormField
                    control={form.control}
                    name={`materialOptions.${idx}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`materialOptions.${idx}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={String(field.value ?? "")}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`materialOptions.${idx}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(v) =>
                            field.onChange(v as AvailabilityStatus)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AvailabilityStatus).map((s) => (
                              <SelectItem key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeMaterial(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendMaterial({
                    name: "",
                    price: 0,
                    status: AvailabilityStatus.AVAILABLE,
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Material
              </Button>
            </div>

            <Separator />

            {/* Finish Options */}
            <div>
              <h3 className="text-lg font-medium mb-4">Finish Options</h3>
              {finishFields.map((ff, idx) => (
                <div
                  key={ff.id}
                  className="grid grid-cols-4 gap-4 border p-4 rounded-lg mb-4 relative"
                >
                  <FormField
                    control={form.control}
                    name={`finishOptions.${idx}.colorName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`finishOptions.${idx}.hexCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hex Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`finishOptions.${idx}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(v) =>
                            field.onChange(v as AvailabilityStatus)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AvailabilityStatus).map((s) => (
                              <SelectItem key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFinish(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendFinish({
                    colorName: "",
                    hexCode: "",
                    status: AvailabilityStatus.AVAILABLE,
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Finish
              </Button>
            </div>

            <Separator />

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUploader field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Creating Product..." : "Create Product"}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
