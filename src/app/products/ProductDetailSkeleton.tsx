// app/products/ProductDetailSkeleton.tsx

export const ProductDetailSkeleton = () => (
  <main className="min-h-screen bg-[#0b0b0b] p-6 sm:p-12 animate-pulse">
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 h-6 w-48 bg-gray-700 rounded"></div>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[3/4] bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-5 gap-3">
            <div className="aspect-square bg-gray-700 rounded-md"></div>
            <div className="aspect-square bg-gray-700 rounded-md"></div>
            <div className="aspect-square bg-gray-700 rounded-md"></div>
            <div className="aspect-square bg-gray-700 rounded-md"></div>
            <div className="aspect-square bg-gray-700 rounded-md"></div>
          </div>
        </div>
        {/* Right Skeleton */}
        <div className="flex flex-col">
          <div className="h-12 w-3/4 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          </div>
          <div className="my-8 border-y border-gray-700 divide-y divide-gray-700">
            <div className="py-6 h-10 w-1/3 bg-gray-700 rounded"></div>
            <div className="py-6 h-24 bg-gray-700 rounded-md mt-[-1px]"></div>
          </div>
          <div className="h-14 w-full bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  </main>
);
