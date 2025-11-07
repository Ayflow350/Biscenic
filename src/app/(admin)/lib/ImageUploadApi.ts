// lib/api.ts

/**
 * Uploads a single image file directly to your Cloudinary account.
 * This function will be called by the ImageUploader as soon as a file is dropped.
 * @param file The image file from the dropzone.
 * @returns A Promise that resolves to the secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env
      .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    console.error("Cloudinary upload failed:", await response.json());
    throw new Error("Image upload failed. Please try again.");
  }

  const data = await response.json();
  return data.secure_url;
};
