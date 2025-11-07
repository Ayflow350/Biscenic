"use client";

import { useCallback } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "../../lib/ImageUploadApi";

type AnyField = any; // eslint-disable-line @typescript-eslint/no-explicit-any

interface ImageUploaderProps {
  field: ControllerRenderProps<AnyField, string>;
}

export function ImageUploader({ field }: ImageUploaderProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const uploadToast = toast.loading("Uploading image...");
      const url = await uploadImageToCloudinary(file);
      toast.dismiss(uploadToast);
      return url;
    },
    onSuccess: (url) => {
      field.onChange(url); // ✅ single image
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      toast.error("Upload Failed", {
        description: error.message || "Could not upload the image.",
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 0) {
        mutate(acceptedFiles[0]); // ✅ only upload first file
      }
    },
    [mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false, // ✅ single file only
  });

  const imageUrl =
    typeof field.value === "string"
      ? field.value
      : field.value instanceof File
      ? URL.createObjectURL(field.value)
      : undefined;

  return (
    <div className="grid w-full max-w-lg gap-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isPending ? "cursor-not-allowed opacity-50 bg-muted" : ""
        } ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/30 hover:border-muted-foreground/50"
        }`}
      >
        <input {...getInputProps()} disabled={isPending} />
        {isPending ? (
          <>
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            <p className="text-sm font-medium">Uploading...</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop image here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </>
        )}
      </div>

      {imageUrl && (
        <div className="relative aspect-square rounded-md overflow-hidden border">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              field.onChange(undefined);
            }}
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      )}
    </div>
  );
}
