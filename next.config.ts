/** @type {import('next').NextConfig} */

const nextConfig = {
  // You can add other config options here if needed

  images: {
    // The remotePatterns array tells Next.js which domains are allowed for images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // Allows any image path from unsplash.com
      },
      // --- THIS IS THE FIX ---
      // Add a new configuration object for your Cloudinary domain.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Allows any image path from your Cloudinary account
      },
      // You can add more domains here if needed in the future
    ],
  },
};

export default nextConfig;
