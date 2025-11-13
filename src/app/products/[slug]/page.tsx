"use client";

// -------------------- Imports --------------------
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/context/cart-context";
import { ModeToggle } from "@/components/mode-toggle";

// Corrected imports for mock data and helpers
import { useProduct } from "@/services/products/queries";
// Note: Assuming ProductImage type now includes 'displayNameOverride?: string'
import type { Product, ProductImage } from "@/app/types";
// DELETED: import { productVariants, Variant } from "@/lib/product-variants";
import { ProductDetailSkeleton } from "@/app/products/ProductDetailSkeleton";
import { convertToCartProduct, isOutOfStock } from "@/lib/product";

// -------------------- Helpers --------------------
const motionVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const getMainImageId = (images: ProductImage[] = []) =>
  (images.find((img) => img.isMain) || images[0])?._id || null;

// --- B'elysium Options ---
type Material = "solid" | "hdf";
type Size = "4.5 ft × 6 ft" | "6 ft × 6 ft";

const B_ELYS_OPTIONS = {
  solid: {
    "4.5 ft × 6 ft": 2800000,
    "6 ft × 6 ft": 3733000,
  },
  hdf: {
    "4.5 ft × 6 ft": 2000000,
    "6 ft × 6 ft": 2670000,
  },
};

// 🚨 NEW DATA STRUCTURE: Lumivase Product Types
type LumivaseType = "Eirene" | "Eclipsera";
const LUMIVASE_OPTIONS = {
  Eirene: {
    material: "Natural Oak",
    price: 850000,
    color: "#c09b6e", // Placeholder color for Eirene wood
  },
  Eclipsera: {
    material: "Obsidian Black",
    price: 950000,
    color: "#1C1C1C", // Placeholder color for Eclipsera wood
  },
};
// 🚨 Consolidated helper for Lumivase options display
type LumivaseSelectionKey = LumivaseType;
const LUMIVASE_SELECTIONS: Record<
  LumivaseSelectionKey,
  { displayName: string; price: number; secondaryDetail: string; color: string }
> = {
  Eirene: {
    displayName: "Lumivase Eirene",
    price: 850000,
    secondaryDetail: "Natural Oak",
    color: LUMIVASE_OPTIONS.Eirene.color,
  },
  Eclipsera: {
    displayName: "Lumivase Eclipsera",
    price: 950000,
    secondaryDetail: "Obsidian Black",
    color: LUMIVASE_OPTIONS.Eclipsera.color,
  },
};

// -------------------- Component --------------------
export default function ProductSlugPage() {
  // =================================================================
  // SECTION 1: HOOKS
  // =================================================================
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading, error } = useProduct(slug);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [carouselState, setCarouselState] = useState<[number, number]>([0, 0]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);

  // 🚨 NEW STATE: For Size Selection (B'elysium)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  // 🚨 NEW STATE: For Lumivase Product Type Selection
  const [selectedLumivaseOption, setSelectedLumivaseOption] =
    useState<LumivaseType | null>(null);

  // --- NEW DERIVED STATE (EARLY) ---
  const images = product?.images || []; // 🚨 DEFINED HERE
  const [activeIndex, direction] = carouselState;
  const activeImage = (images[activeIndex] ?? images[0]) as ProductImage & {
    displayNameOverride?: string;
  };

  const displayName = useMemo(() => {
    // 🚨 UPDATED: Use selectedProductType name if it's a Lumivase product
    if (product?.name?.includes("Lumivase") && selectedLumivaseOption) {
      return `Lumivase ${selectedLumivaseOption}`;
    }
    return activeImage?.displayNameOverride || product?.name || "";
  }, [product, activeImage, selectedLumivaseOption]);
  // --- END NEW DERIVED STATE ---

  const isBelysium = product?.name.includes("B'elysium");

  // 🚨 CORRECTED LUMIVASE CHECK: Check if the product name matches any Lumivase variant
  const LUMIVASE_PRODUCT_NAMES = [
    "Eirene",
    "Ivory Silence",
    "Eclipsera",
    "Lumivase",
  ];
  const isLumivase =
    product &&
    LUMIVASE_PRODUCT_NAMES.some((name) => product?.name?.includes(name)) &&
    !isBelysium;

  const defaultActiveTab = useMemo(
    () =>
      isBelysium
        ? "materials"
        : isLumivase
        ? "specifications"
        : "specifications",
    [isBelysium, isLumivase]
  );
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [selectedFinish, setSelectedFinish] = useState<
    "walnut brown" | "night" | null
  >(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // 🚨 NEW HELPER: Get the available size options based on selected material
  const sizeOptions = useMemo(() => {
    if (selectedMaterial && B_ELYS_OPTIONS[selectedMaterial]) {
      return B_ELYS_OPTIONS[selectedMaterial];
    }
    return null;
  }, [selectedMaterial]);

  // 🚨 NEW HELPER: Reset size when material changes
  const handleSelectMaterial = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setSelectedSize(null);
    setCurrentPrice(null);
  }, []);

  // 🚨 NEW HELPER: Set size and update price
  const handleSelectSize = useCallback((size: Size) => {
    setSelectedSize(size);
  }, []);

  const handleSelectProductType = useCallback((type: LumivaseType) => {
    setSelectedLumivaseOption(type);
  }, []);

  const handleAddToCart = useCallback(() => {
    // 🚨 UPDATED CHECK: Handle missing options for both products
    const isBelysiumValid =
      isBelysium && (!selectedMaterial || !selectedSize || !selectedFinish);
    const isLumivaseValid = isLumivase && !selectedLumivaseOption;

    if (
      !product ||
      currentPrice === null ||
      isBelysiumValid ||
      isLumivaseValid
    ) {
      console.error("Missing required product options.");
      return;
    }

    const baseCartProduct = convertToCartProduct(product);
    let finalName = displayName;
    let finalId = product._id;

    // 🚨 UPDATED NAME & ID: Handle B'elysium
    if (isBelysium && selectedMaterial && selectedFinish && selectedSize) {
      const materialName =
        selectedMaterial === "solid" ? "Solid Wood" : "HDF Wood";
      const finishName =
        selectedFinish === "walnut brown" ? "Walnut Brown" : "Night";

      finalName = `${displayName} (${materialName}, ${selectedSize}, ${finishName})`;

      const finishIdPart = selectedFinish.replace(/\s+/g, "_");
      const sizeIdPart = selectedSize.replace(/\s/g, "_").replace(/×/g, "x");
      finalId = `${product._id}_${selectedMaterial}_${sizeIdPart}_${finishIdPart}`;
    }
    // 🚨 NEW NAME & ID: Handle Lumivase
    else if (isLumivase && selectedLumivaseOption) {
      const option = LUMIVASE_OPTIONS[selectedLumivaseOption];
      finalName = `${displayName} (${option.material})`;
      finalId = `${product._id}_${selectedLumivaseOption.replace(/\s/g, "_")}`;
    }

    const customizedCartProduct = {
      ...baseCartProduct,
      id: finalId,
      price: String(currentPrice),
      quantity: quantity,
      name: finalName,
    };

    addToCart(customizedCartProduct);
  }, [
    product,
    addToCart,
    currentPrice,
    quantity,
    displayName,
    selectedMaterial,
    selectedFinish,
    selectedSize,
    selectedLumivaseOption,
    isBelysium,
    isLumivase,
  ]);

  const navigateModalImage = useCallback(
    (dir: "prev" | "next") => {
      if (!product?.images?.length) return;
      const total = product.images.length;
      setCurrentModalImageIndex((p) =>
        dir === "prev" ? (p - 1 + total) % total : (p + 1) % total
      );
    },
    [product]
  );

  useEffect(() => {
    // 🚨 MODIFIED PRICE EFFECT: Handle both B'elysium and Lumivase
    if (!product) return;

    if (isBelysium) {
      if (selectedMaterial && selectedSize) {
        setCurrentPrice(B_ELYS_OPTIONS[selectedMaterial][selectedSize] || null);
      } else {
        setCurrentPrice(null);
      }
    } else if (isLumivase) {
      if (selectedLumivaseOption) {
        setCurrentPrice(LUMIVASE_OPTIONS[selectedLumivaseOption].price);
      } else {
        setCurrentPrice(null);
      }
    } else {
      setCurrentPrice(product.price as number);
    }
  }, [
    product,
    isBelysium,
    isLumivase,
    selectedMaterial,
    selectedSize,
    selectedLumivaseOption,
  ]);

  useEffect(() => {
    if (!product?.images?.length) return;
    if (!selectedImageId) {
      const mainId = getMainImageId(product.images);
      setSelectedImageId(mainId);
      const idx = product.images.findIndex((i) => i._id === mainId);
      setCarouselState([Math.max(0, idx), 0]);
    } else {
      const idx = product.images.findIndex((i) => i._id === selectedImageId);
      if (idx >= 0) setCarouselState(([prev]) => [idx, idx > prev ? 1 : -1]);
    }
  }, [product, selectedImageId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "ArrowLeft") navigateModalImage("prev");
      if (e.key === "ArrowRight") navigateModalImage("next");
      if (e.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isModalOpen, navigateModalImage]);

  // =================================================================
  // SECTION 2: EARLY RETURNS
  // =================================================================
  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Product not found.
      </div>
    );
  }

  // =================================================================
  // SECTION 3: DERIVED STATE & RENDER LOGIC
  // =================================================================
  // Variables are available from SECTION 1: HOOKS scope.
  const isEclipsera = displayName.includes("Eclipsera");
  const isEirene = displayName.includes("Eirene");
  const isIvorySilence = displayName.includes("Ivory Silence");
  // 🚨 NEW CHECK: Determine if the current product is the one that should be out of stock
  const isCrimson = displayName.includes("Crimson");

  const formatCurrencyDisplay = (val: number | null) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(val ?? 0);

  const selectImageByIndex = (idx: number) => {
    setCarouselState(([cur]) => [idx, idx > cur ? 1 : -1]);
    setSelectedImageId(product?.images?.[idx]?._id ?? null);
  };

  const openImageModal = (idx: number) => {
    setCurrentModalImageIndex(idx);
    setIsModalOpen(true);
  };

  const tabs = isBelysium
    ? [
        { id: "materials", label: "Material Options" },
        { id: "features", label: "Luxury Features" },
        { id: "editions", label: "Editions" },
        { id: "experience", label: "Experience" },
      ]
    : [
        { id: "specifications", label: "Specifications" },
        { id: "technology", label: "Integrated Technology" },
        { id: "editions", label: "Editions" },
        { id: "experience", label: "Experience" },
      ];

  // 🚨 UPDATED CHECK: Handle missing options for both products
  const isBelysiumMissing =
    isBelysium && (!selectedMaterial || !selectedSize || !selectedFinish);
  const isLumivaseMissing = isLumivase && !selectedLumivaseOption;
  const isMissingOptions = isBelysiumMissing || isLumivaseMissing;

  // 🚨 CRITICAL FIX: The final out-of-stock state includes the global product check and the Crimson/Ivory Silence checks
  const isProductUnavailable =
    isOutOfStock(product) || isCrimson || isIvorySilence;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/collections"
            // 🚨 FIX 1: Change hover color from gold to a theme-aware color
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground/80"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Collections
          </Link>
          <ModeToggle />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-muted/20">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  className="absolute h-full w-full"
                  custom={direction}
                  variants={motionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Image
                    src={activeImage?.url ?? "/placeholder.jpg"}
                    alt={displayName}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <button
                  key={img._id}
                  onClick={() => selectImageByIndex(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition ${
                    idx === activeIndex
                      ? // 🚨 FIX 2: Change active border from gold to black/ring-foreground
                        "border-foreground ring-2 ring-foreground/50"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.styleName ?? displayName}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-wider mb-4">
              {displayName}
            </h1>
            <div className="text-muted-foreground leading-relaxed mb-8 flex flex-col space-y-4">
              {isBelysium && (
                <>
                  <p>
                    To rest in B’elysium is to enter a dialogue between silence
                    and presence. The bed cradle the body as it listens,
                    responds, and heals. It is designed as both a centerpiece of
                    living art and a wellness system, bridging ancient rituals
                    of rest with futuristic intelligence.
                  </p>
                  <p className="pt-2 italic">
                    B’elysium is not simply furniture.
                    <br />
                    It is a portal to renewal.
                  </p>
                </>
              )}
              {isEclipsera && (
                <>
                  <p>
                    The Lumivase Eclipsera is sculpted with a sleek black oak
                    frame and glass enclosure, housing a bonsai grounded in a
                    bed of black pebbles. At its center, a glowing light
                    transitions through a full spectrum of colors, surrounded by
                    a lava inspired halo that radiates from below.
                  </p>
                  <p>
                    Its design follows geometric principles and astronomical
                    cycles, with forms guided by the golden ratio to create
                    harmony between structure, light, and nature. Eclipsera
                    embodies the balance of shadow and illumination, geometry
                    and nature, an object that restores order and presence to
                    any space.
                  </p>
                </>
              )}
              {(isEirene || isIvorySilence) && (
                <p>
                  Sculpted from oak wood, framed in glass, and grounded in white
                  sand and stones, the Lumivase Eirene holds a bonsai that
                  represents harmony and resilience. It combines natural
                  elements with thoughtful design and integrated technology to
                  create calm, clarity, and balance in any space.
                </p>
              )}
            </div>
            <div className="border-y border-border divide-y divide-border mb-8">
              <div className="py-6">
                <p className="text-2xl font-medium">
                  {formatCurrencyDisplay(currentPrice)}
                  {/* 🚨 UPDATED TEXT: Indicate price is for starting size or requires selection */}
                  {isMissingOptions && (
                    <span className="text-sm text-muted-foreground ml-2">
                      {" "}
                      (Select options)
                    </span>
                  )}
                </p>
              </div>

              {/* 🚨 NEW: LUMIVASE PRODUCT TYPE SELECTION (If it is the base Lumivase) */}
              {isLumivase && (
                <div className="py-6">
                  <p className="uppercase text-sm tracking-widest text-muted-foreground mb-4">
                    Select Material
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Map the consolidated Lumivase options */}
                    {Object.entries(LUMIVASE_SELECTIONS).map(
                      ([type, options]) => (
                        <button
                          key={type}
                          onClick={() =>
                            handleSelectProductType(type as LumivaseType)
                          }
                          className={`text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                            selectedLumivaseOption === type
                              ? "border-foreground bg-foreground/10 ring-2 ring-foreground/50"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* 🚨 COLOR SWATCH ELEMENT */}
                            <div
                              className="w-6 h-6 rounded-full border border-muted-foreground/50"
                              style={{ backgroundColor: options.color }}
                            ></div>

                            <span className="font-semibold text-foreground block">
                              {options.displayName}
                            </span>
                          </div>

                          <span className="text-sm text-muted-foreground block mt-1">
                            {options.secondaryDetail}
                          </span>
                          <span className="text-sm text-muted-foreground block">
                            {formatCurrencyDisplay(options.price)}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
              {/* END LUMIVASE SELECTION */}

              {isBelysium && (
                <>
                  {/* MATERIAL SELECTION */}
                  <div className="py-6">
                    <p className="uppercase text-sm tracking-widest text-muted-foreground mb-4">
                      Select Material
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSelectMaterial("solid")} // 🚨 USE NEW HANDLER
                        className={`text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedMaterial === "solid"
                            ? // 🚨 FIX 3: Change material selection ring/border from gold to black/foreground
                              "border-foreground bg-foreground/10 ring-2 ring-foreground/50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span className="font-semibold text-foreground block">
                          Solid Wood
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrencyDisplay(
                            B_ELYS_OPTIONS.solid["4.5 ft × 6 ft"]
                          )}{" "}
                          (4.5x6 ft starting)
                        </span>
                      </button>
                      <button
                        onClick={() => handleSelectMaterial("hdf")} // 🚨 USE NEW HANDLER
                        className={`text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedMaterial === "hdf"
                            ? // 🚨 FIX 3: Change material selection ring/border from gold to black/foreground
                              "border-foreground bg-foreground/10 ring-2 ring-foreground/50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span className="font-semibold text-foreground block">
                          HDF Wood
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrencyDisplay(
                            B_ELYS_OPTIONS.hdf["4.5 ft × 6 ft"]
                          )}{" "}
                          (4.5x6 ft starting)
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 🚨 NEW: SIZE SELECTION (Conditionally render after material selection) */}
                  {selectedMaterial && sizeOptions && (
                    <div className="py-6">
                      <p className="uppercase text-sm tracking-widest text-muted-foreground mb-4">
                        Select Size
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(sizeOptions).map(([size, price]) => (
                          <button
                            key={size}
                            onClick={() => handleSelectSize(size as Size)} // 🚨 USE NEW HANDLER
                            className={`text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                              selectedSize === size
                                ? "border-foreground bg-foreground/10 ring-2 ring-foreground/50"
                                : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <span className="font-semibold text-foreground block">
                              {size}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrencyDisplay(price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* END SIZE SELECTION */}

                  {/* FINISH SELECTION */}
                  <div className="py-6">
                    <p className="uppercase text-sm tracking-widest text-muted-foreground mb-4">
                      Select Finish
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedFinish("walnut brown")}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedFinish === "walnut brown"
                            ? // 🚨 FIX 4: Change finish selection ring/border from gold to black/foreground
                              "border-foreground bg-foreground/10 ring-2 ring-foreground/50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border border-muted-foreground/50"
                            style={{ backgroundColor: "#5C3A21" }}
                          ></div>
                          <span className="font-semibold text-foreground">
                            B'ELYSIUM WALNUT BROWN
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedFinish("night")}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedFinish === "night"
                            ? // 🚨 FIX 4: Change finish selection ring/border from gold to black/foreground
                              "border-foreground bg-foreground/10 ring-2 ring-foreground/50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border border-muted-foreground/50"
                            style={{ backgroundColor: "#1C1C1C" }}
                          ></div>
                          <span className="font-semibold text-foreground">
                            B'ELYSIUM NIGHT
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* QUANTITY SELECTION */}
              {/* 🚨 CONDITIONAL RENDER: Hide Quantity selector if Crimson or Ivory Silence is selected */}
              {!isProductUnavailable ? (
                <div className="py-6 flex justify-between items-center">
                  <p className="uppercase text-sm tracking-widest text-muted-foreground">
                    Quantity
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity === 1}
                      className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1 border border-border rounded-md hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                // 🚨 NEW MESSAGE: Show the "Out of Stock" message instead of the selector
                <div className="py-6 text-center">
                  <p className="text-lg font-semibold text-red-500">
                    {displayName} is currently unavailable.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please check back later or select a different option.
                  </p>
                </div>
              )}
            </div>

            <Button
              // 🚨 UPDATED DISABLED CHECK: Handle missing options for both products
              onClick={handleAddToCart}
              disabled={isProductUnavailable || isMissingOptions}
              className={`w-full font-bold uppercase tracking-wider px-8 py-4 rounded-md transition-colors ${
                isProductUnavailable || isMissingOptions
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : // 🚨 FIX 5: Change button background to black and text to white for light mode minimalist
                    "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isProductUnavailable
                ? "OUT OF STOCK"
                : // 🚨 UPDATED MESSAGES: Priority based on dependency
                isLumivase && !selectedLumivaseOption
                ? "Select Product Type"
                : isBelysium && !selectedMaterial
                ? "Select a Material"
                : isBelysium && !selectedSize
                ? "Select a Size"
                : isBelysium && !selectedFinish
                ? "Select a Finish"
                : "ADD TO CART"}
            </Button>

            {/* --- TABS SECTION (RESTORED) --- */}
            <div className="mt-12">
              <div className="flex flex-wrap gap-6 border-b border-border pb-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`uppercase tracking-widest text-sm pb-1 ${
                      activeTab === t.id
                        ? // 🚨 FIX 6: Change active tab text/border from gold to black/foreground
                          "text-foreground border-b-2 border-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-muted-foreground leading-relaxed space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isBelysium ? (
                      <>
                        {activeTab === "materials" && (
                          <div className="space-y-8">
                            <div>
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Handcrafted Solid Wood
                              </h3>
                              <p className="text-muted-foreground mb-3">
                                Premium artisanal finish with natural grain
                                patterns. Ideal for collectors who value
                                traditional craftsmanship and timeless
                                durability.
                              </p>
                              {/* 🚨 UPDATED DISPLAY: Show size options */}
                              <ul className="list-disc ml-6 mt-4 space-y-2">
                                {Object.entries(B_ELYS_OPTIONS.solid).map(
                                  ([size, price]) => (
                                    <li key={size}>
                                      <span className="font-medium text-foreground">
                                        {size}:
                                      </span>{" "}
                                      <span className="text-foreground font-medium">
                                        {formatCurrencyDisplay(price)}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            <div className="pt-8 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                High Density Fiber (HDF) Wood
                              </h3>
                              <p className="text-muted-foreground mb-3">
                                Refined engineered finish with smooth, modern
                                consistency. Ideal for those seeking a more
                                contemporary aesthetic at a lower entry price.
                              </p>
                              {/* 🚨 UPDATED DISPLAY: Show size options */}
                              <ul className="list-disc ml-6 mt-4 space-y-2">
                                {Object.entries(B_ELYS_OPTIONS.hdf).map(
                                  ([size, price]) => (
                                    <li key={size}>
                                      <span className="font-medium text-foreground">
                                        {size}:
                                      </span>{" "}
                                      <span className="text-foreground font-medium">
                                        {formatCurrencyDisplay(price)}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            <div className="pt-8 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Functions & Features
                              </h3>
                              <p className="text-muted-foreground">
                                Regardless of the wood selection, both editions
                                maintain the same specifications and luxury
                                functions:
                              </p>
                              <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>Ambient halo lighting system</li>
                                <li>Therapeutic audio with ASMR soundscapes</li>
                                <li>Biometric wellness monitoring</li>
                                <li>NFC + Bluetooth smart access</li>
                              </ul>
                            </div>
                          </div>
                        )}
                        {activeTab === "features" && (
                          <div>
                            <h3 className="text-foreground font-semibold text-lg mb-2">
                              Luxury Features (Standard in All Editions)
                            </h3>
                            <ul className="list-disc ml-6 space-y-2">
                              <li>
                                <strong>Ambient Halo Lighting:</strong>{" "}
                                Circadian rhythm tuned LED illumination that
                                shifts from warm dusk glows to dawn radiance.
                              </li>
                              <li>
                                <strong>Therapeutic Audio System:</strong>{" "}
                                Embedded ASMR soundscapes and Bluetooth
                                resonance panels that transform the frame into
                                an instrument of tranquility.
                              </li>
                              <li>
                                <strong>Biometric Wellness Monitoring:</strong>{" "}
                                Discreet sensors for sleep cycles, heart rate,
                                and restorative patterns.
                              </li>
                              <li>
                                <strong>Smart Access:</strong> NFC +
                                Bluetooth-enabled secure entry and
                                customization.
                              </li>
                              <li>
                                <strong>
                                  Hidden Storage Vault (Optional):
                                </strong>{" "}
                                Concealed compartment for personal artifacts.
                              </li>
                            </ul>
                          </div>
                        )}
                        {activeTab === "editions" && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                B’elysium Base Edition
                              </h3>
                              <p className="font-semibold text-foreground">
                                Includes:
                              </p>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>Halo lighting system</li>
                                <li>Therapeutic audio</li>
                                <li>NFC + Bluetooth access</li>
                                <li>Hidden storage vault</li>
                              </ul>
                              <p className="mt-3 font-semibold text-foreground">
                                Excludes:
                              </p>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>Biometric monitoring</li>
                                <li>AI Assistant</li>
                                <li>Temperature Regulation System</li>
                              </ul>
                              <p className="mt-4 text-muted-foreground italic">
                                This edition is designed for those who want
                                timeless luxury and wellness benefits, with a
                                focus on simplicity and craft.
                              </p>
                            </div>
                            <div className="pt-6 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                B’elysium Sentient Edition
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>
                                  <strong>AI Assistant “B’voice”:</strong> A
                                  voice responsive system that learns personal
                                  routines, plays tailored soundscapes, adjusts
                                  lighting, and integrates with the wider
                                  Biscenic ecosystem.
                                </li>
                                <li>
                                  <strong>Temperature Regulation:</strong>{" "}
                                  Precision climate control embedded within the
                                  bed, adjusting to body heat and preferences
                                  for optimal comfort throughout the night.
                                </li>
                              </ul>
                              <p className="mt-4 text-muted-foreground italic">
                                This edition transforms B’elysium into a living
                                companion, a sentient sanctuary attuned to the
                                rhythms of mind, body, and soul.
                              </p>
                            </div>
                          </div>
                        )}
                        {activeTab === "experience" && (
                          <p>
                            To rest in B’elysium is to embrace stillness
                            reimagined. Whether you choose the Base Edition or
                            elevate to the sentient Edition, the bed becomes a
                            remedy for the soul a union of art, technology, and
                            wellness that transcends ordinary sleep
                          </p>
                        )}
                      </>
                    ) : isEclipsera ||
                      isEirene ||
                      isIvorySilence ||
                      isLumivase ? (
                      <>
                        {activeTab === "specifications" && (
                          <div>
                            <h3 className="text-foreground font-semibold text-lg mb-2">
                              Design & Materials
                            </h3>
                            <ul className="list-disc ml-6 space-y-2">
                              {/* Display selected type material */}
                              {selectedLumivaseOption && (
                                <li>
                                  <strong>Type:</strong>{" "}
                                  {selectedLumivaseOption}
                                </li>
                              )}
                              <li>
                                <strong>Frame:</strong> Hard Wood (Mansonia /
                                Natural Oak / Obsidian Black)
                              </li>
                              <li>
                                <strong>Encasement:</strong> Crystal clear glass
                              </li>
                              <li>
                                <strong>Base Layer:</strong> White sand or Black
                                pebbles (depending on type)
                              </li>
                              <li>
                                <strong>Flora:</strong> Bonsai tree
                              </li>
                            </ul>
                          </div>
                        )}
                        {activeTab === "technology" && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Dynamic Lighting System
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>
                                  Central core transitions across full RGB
                                  spectrum
                                </li>
                                <li>
                                  Lava halo base or White glow (depending on
                                  type)
                                </li>
                                <li>Adjustable intensity</li>
                              </ul>
                            </div>
                            <div className="pt-6 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Bluetooth Audio Resonance System
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>
                                  Supports meditative tones, ASMR soundscapes,
                                  and ambient audio
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                        {activeTab === "editions" && (
                          <div className="space-y-6">
                            {/* Simplified Editions */}
                            <div>
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Base Edition
                              </h3>
                              <p className="mt-3 text-muted-foreground italic">
                                Includes essential integrated technology and
                                craftsmanship.
                              </p>
                            </div>
                            <div className="pt-6 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Sentient Edition
                              </h3>
                              <p className="mt-3 text-muted-foreground italic">
                                Includes the AI Sentient Module for interactive
                                wellness guidance.
                              </p>
                            </div>
                          </div>
                        )}
                        {activeTab === "experience" && (
                          <p>
                            The Lumivase is a vessel of rhythm and alignment,
                            transforming light, sound, and form into a
                            continuous dialogue of balance and renewal.
                          </p>
                        )}
                      </>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] bg-background p-6 border-border">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            {images[currentModalImageIndex] && (
              <>
                <Image
                  src={images[currentModalImageIndex].url}
                  alt={`${displayName} Full View`}
                  fill
                  className="object-contain"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 bg-secondary/50 hover:bg-secondary/80 rounded-full p-3 text-secondary-foreground"
                      onClick={() => navigateModalImage("prev")}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 bg-secondary/50 hover:bg-secondary/80 rounded-full p-3 text-secondary-foreground"
                      onClick={() => navigateModalImage("next")}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <a
        href={`https://wa.me/2348061789132?text=${encodeURIComponent(
          `Hello, I have a question about your products.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        // 🚨 FIX 8: Change WhatsApp button background from gold to black/foreground
        className="fixed bottom-8 right-8 z-50 bg-foreground text-background p-4 rounded-full shadow-lg hover:bg-foreground/90 transition-all duration-300 transform hover:scale-110"
        aria-label="Contact Customer Service on WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </main>
  );
}
