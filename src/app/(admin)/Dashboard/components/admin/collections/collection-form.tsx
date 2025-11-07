// components/admin/collections/collection-form.tsx
"use client";

import * as z from "zod";
import { useForm, SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { createCollection, uploadImageToCloudinary } from "@/lib/CollectionApi";
import { ImageUploader } from "../../../shared/ImageUploader"; // Assuming you create a reusable uploader

// Zod schema for the form, mapping to your Mongoose model
const collectionFormSchema = z.object({
  name: z.string().min(3, "Collection name is too short."),
  description: z.string().min(10, "Description is too short."),
  bannerImage: z.union([z.instanceof(File), z.string()]).optional(),
  featuredImage: z.union([z.instanceof(File), z.string()]).optional(),
  highlights: z
    .string()
    .optional()
    .transform((val) =>
      (val ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      (val ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  isFeatured: z.boolean().default(false),
});

type CollectionFormInput = z.input<typeof collectionFormSchema>;
type CollectionFormOutput = z.output<typeof collectionFormSchema>;

export function CollectionForm() {
  const queryClient = useQueryClient();
  const resolver = zodResolver(
    collectionFormSchema
  ) as unknown as Resolver<CollectionFormInput>;
  const form = useForm<CollectionFormInput>({
    resolver,
    defaultValues: {
      name: "",
      description: "",
      isFeatured: false,
      highlights: "",
      tags: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CollectionFormOutput) => {
      let bannerImageUrl = values.bannerImage;
      let featuredImageUrl = values.featuredImage;

      // Upload banner image if it's a file
      if (bannerImageUrl instanceof File) {
        toast.info("Uploading banner image...");
        bannerImageUrl = await uploadImageToCloudinary(bannerImageUrl);
      }

      // Upload featured image if it's a file
      if (featuredImageUrl instanceof File) {
        toast.info("Uploading featured image...");
        featuredImageUrl = await uploadImageToCloudinary(featuredImageUrl);
      }

      const finalPayload = {
        ...values,
        bannerImage: bannerImageUrl as string | undefined,
        featuredImage: featuredImageUrl as string | undefined,
      };

      return createCollection(finalPayload);
    },
    onSuccess: () => {
      toast.success("Collection Created!", {
        description: "The new collection has been added to your store.",
      });
      queryClient.invalidateQueries({ queryKey: ["collections"] }); // Refetch collections
      form.reset();
    },
    onError: (error) => {
      toast.error("Creation Failed", { description: error.message });
    },
  });

  const onSubmit: SubmitHandler<CollectionFormInput> = (values) => {
    const parsed = collectionFormSchema.parse(values);
    mutate(parsed);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Aurora Collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this collection..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highlights</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Handcrafted, Sustainable, Modern"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Separate each highlight with a comma.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., dining, oak, minimalist"
                  {...field}
                />
              </FormControl>
              <FormDescription>Separate each tag with a comma.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bannerImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image (Optional)</FormLabel>
              <FormControl>
                <ImageUploader field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image (Optional)</FormLabel>
              <FormControl>
                <ImageUploader field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Feature this Collection</FormLabel>
                <FormDescription>
                  If enabled, this collection may appear on the homepage.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Creating..." : "Create Collection"}
        </Button>
      </form>
    </Form>
  );
}
