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

const B_ELYS_PRICES = {
  solid: 2800000,
  hdf: 2000000,
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
  // DELETED: const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);

  // --- NEW DERIVED STATE (EARLY) ---
  const images = product?.images || []; // 🚨 DECLARED HERE (Correct Scope)
  const [activeIndex, direction] = carouselState;
  // Casting activeImage to allow access to the new property without a global type change in this file
  const activeImage = (images[activeIndex] ?? images[0]) as ProductImage & {
    displayNameOverride?: string;
  };

  const displayName = useMemo(() => {
    // Check the active image for an override name, otherwise fall back to the base product name
    return activeImage?.displayNameOverride || product?.name || "";
  }, [product, activeImage]);
  // --- END NEW DERIVED STATE ---

  const isBelysium = product?.name.includes("B'elysium");
  const defaultActiveTab = useMemo(
    () => (isBelysium ? "materials" : "specifications"),
    [isBelysium]
  );
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  const [selectedMaterial, setSelectedMaterial] = useState<
    "solid" | "hdf" | null
  >(null);
  const [selectedFinish, setSelectedFinish] = useState<
    "walnut brown" | "night" | null
  >(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // DELETED: const displayName = currentVariant?.displayName || product?.name || "";

  const handleAddToCart = useCallback(() => {
    if (!product || currentPrice === null) return;
    const isBelysiumProduct = product.name.includes("B'elysium");

    if (isBelysiumProduct && (!selectedMaterial || !selectedFinish)) {
      console.error("Material and Finish must be selected for B'elysium");
      return;
    }

    const baseCartProduct = convertToCartProduct(product);
    let finalName = displayName;
    let finalId = product._id;

    if (isBelysiumProduct && selectedMaterial && selectedFinish) {
      const materialName =
        selectedMaterial === "solid" ? "Solid Wood" : "HDF Wood";
      const finishName =
        selectedFinish === "walnut brown" ? "Walnut Brown" : "Night";
      finalName = `${displayName} (${materialName}, ${finishName})`;
      const finishIdPart = selectedFinish.replace(/\s+/g, "_");
      finalId = `${product._id}_${selectedMaterial}_${finishIdPart}`;
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
    displayName, // 'displayName' is still used, but now calculated by useMemo
    selectedMaterial,
    selectedFinish,
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
    if (!product) return;
    let basePrice: number;
    if (isBelysium) {
      basePrice =
        selectedMaterial === "hdf" ? B_ELYS_PRICES.hdf : B_ELYS_PRICES.solid;
    } else {
      basePrice = product.price as number;
    }
    setCurrentPrice(basePrice);
  }, [product, isBelysium, selectedMaterial]);

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

  // DELETED: useEffect for setCurrentVariant (since currentVariant state is removed)
  /*
  useEffect(() => {
    if (!product || !selectedImageId) return;
    const variants = productVariants[product.name] || [];
    const variant = variants.find((v) => v.imageId === selectedImageId) || null;
    setCurrentVariant(variant);
  }, [selectedImageId, product]);
  */

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
  // 🚨 FIX: Removed redundant declaration of 'images', 'activeIndex', 'direction', 'activeImage'
  const isEclipsera = displayName.includes("Eclipsera");
  const isEirene = displayName.includes("Eirene");
  const isIvorySilence = displayName.includes("Ivory Silence");

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

  const isBelysiumAndMissingOptions =
    isBelysium && (!selectedMaterial || !selectedFinish);

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
              {isEirene && (
                <>
                  <p>
                    Nature held in form sand, gemstones, and oak; a meeting
                    place of nature and technology. A vessel that listens as
                    much as she holds.
                  </p>
                  <p>Year: 2025 Origin: Biscenic</p>
                  <p>
                    The Lumivase Eirene was born from a desire to weave two
                    realms into one vessel the stillness of nature and the quiet
                    hum of modern life. Sand and gemstones recall rivers and
                    earth, grounding her in memory, while the oak frame offers
                    permanence. Sound threads through as a living pulse. She
                    listens and responds, reminding us that technology can feel
                    alive when it moves with nature, not against it.
                  </p>
                  <p>
                    “She is a fragment of atmosphere, a gesture beyond living.”
                  </p>
                </>
              )}

              {isIvorySilence && (
                <>
                  <p>
                    Sculpted from oak wood, framed in glass, and grounded in
                    white sand and stones, the Lumivase holds a bonsai that
                    represents harmony and resilience. It combines natural
                    elements with thoughtful design and integrated technology to
                    create calm, clarity, and balance in any space.
                  </p>
                </>
              )}
            </div>
            <div className="border-y border-border divide-y divide-border mb-8">
              <div className="py-6">
                <p className="text-2xl font-medium">
                  {formatCurrencyDisplay(currentPrice)}
                </p>
              </div>

              {isBelysium && (
                <>
                  {/* MATERIAL SELECTION */}
                  <div className="py-6">
                    <p className="uppercase text-sm tracking-widest text-muted-foreground mb-4">
                      Select Material
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedMaterial("solid")}
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
                          {formatCurrencyDisplay(B_ELYS_PRICES.solid)}
                        </span>
                      </button>
                      <button
                        onClick={() => setSelectedMaterial("hdf")}
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
                          {formatCurrencyDisplay(B_ELYS_PRICES.hdf)}
                        </span>
                      </button>
                    </div>
                  </div>

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
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock(product) || isBelysiumAndMissingOptions}
              className={`w-full font-bold uppercase tracking-wider px-8 py-4 rounded-md transition-colors ${
                isOutOfStock(product) || isBelysiumAndMissingOptions
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : // 🚨 FIX 5: Change button background to black and text to white for light mode minimalist
                    "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isOutOfStock(product)
                ? "OUT OF STOCK"
                : isBelysium && !selectedMaterial
                ? "Select a Material"
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
                              {/* 🚨 FIX 7: Change price text from gold to black/foreground */}
                              <span className="text-foreground font-medium">
                                {formatCurrencyDisplay(B_ELYS_PRICES.solid)}
                              </span>
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
                              {/* 🚨 FIX 7: Change price text from gold to black/foreground */}
                              <span className="text-foreground font-medium">
                                {formatCurrencyDisplay(B_ELYS_PRICES.hdf)}
                              </span>
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
                    ) : isEclipsera ? (
                      <>
                        {activeTab === "specifications" && (
                          <div>
                            <h3 className="text-foreground font-semibold text-lg mb-2">
                              Design & Materials
                            </h3>
                            <ul className="list-disc ml-6 space-y-2">
                              <li>
                                <strong>Frame:</strong> Black oak wood with a
                                matte finish
                              </li>
                              <li>
                                <strong>Encasement:</strong> Clear glass for
                                360° immersion
                              </li>
                              <li>
                                <strong>Base Layer:</strong> Polished black
                                pebbles, grounding the composition
                              </li>
                              <li>
                                <strong>Core:</strong> Central illumination with
                                smooth, full spectrum transitions
                              </li>
                              <li>
                                <strong>Accent:</strong> Lava halo glow,
                                circling the base like an eclipse
                              </li>
                              <li>
                                <strong>Geometry:</strong> Design proportions
                                aligned with golden ratio and orbital symmetry
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
                                  Lava halo base provides steady ambient glow
                                </li>
                                <li>
                                  Adjustable intensity for different moods and
                                  settings
                                </li>
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
                            <div>
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Eclipsera Base Edition
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>Black oak and glass frame</li>
                                <li>
                                  Bonsai installation with black pebble
                                  foundation
                                </li>
                                <li>
                                  Full spectrum lighting and lava halo base
                                </li>
                                <li>
                                  Geometric proportions aligned with golden
                                  ratio
                                </li>
                                <li>Bluetooth audio system</li>
                              </ul>
                              <p className="mt-3 text-muted-foreground italic">
                                For those who seek a balance of modern design,
                                natural presence, and geometric order.
                              </p>
                            </div>
                            <div className="pt-6 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Eclipsera Sentient Edition
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>Everything in the Base Edition</li>
                                <li>
                                  <strong>AI Sentient Module:</strong> listens
                                  and responds with voice interaction
                                </li>
                                <li>
                                  Personalized meditation and wellness guidance
                                </li>
                                <li>
                                  Lighting and audio that adapt to time, mood,
                                  and environment
                                </li>
                                <li>
                                  Geometry driven adaptive modes inspired by
                                  lunar and orbital cycles
                                </li>
                              </ul>
                              <p className="mt-3 text-muted-foreground italic">
                                For those who want an interactive artifact that
                                listens, adapts, and restores harmony through
                                proportion and presence.
                              </p>
                            </div>
                          </div>
                        )}
                        {activeTab === "experience" && (
                          <p>
                            The Lumivase Eclipsera draws from both astronomy and
                            geometry. Its glowing core, eclipse like halo, and
                            balanced proportions make it a vessel of rhythm and
                            alignment. It transforms light, sound, and form into
                            a continuous dialogue of balance and renewal.
                          </p>
                        )}
                      </>
                    ) : isEirene || isIvorySilence ? (
                      <>
                        {activeTab === "specifications" && (
                          <div>
                            <h3 className="text-foreground font-semibold text-lg mb-2">
                              Design & Materials
                            </h3>
                            <ul className="list-disc ml-6 space-y-2">
                              <li>
                                <strong>Frame:</strong> Solid oak wood with a
                                natural matte finish
                              </li>
                              <li>
                                <strong>Encasement:</strong> Crystal clear glass
                                for 360° viewing
                              </li>
                              <li>
                                <strong>Base Layer:</strong> White sand shaped
                                into flowing patterns
                              </li>
                              <li>
                                <strong>Stones:</strong> Selected white rocks
                                for purity and grounding
                              </li>
                              <li>
                                <strong>Flora:</strong> Bonsai tree, crafted and
                                shaped with care
                              </li>
                            </ul>
                          </div>
                        )}
                        {activeTab === "technology" && (
                          <div>
                            <h3 className="text-foreground font-semibold text-lg mb-2">
                              Bluetooth Audio Resonance System
                            </h3>
                            <ul className="list-disc ml-6 space-y-2">
                              <li>
                                Built in sound chamber for ambient soundscapes
                              </li>
                              <li>
                                Supports curated playlists: ASMR tones, natural
                                harmonics, meditation tracks
                              </li>
                            </ul>
                          </div>
                        )}
                        {activeTab === "editions" && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Eirene Base Edition
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>Handcrafted oak and glass structure</li>
                                <li>White sand and white rock foundation</li>
                                <li>Bonsai installation</li>
                                <li>
                                  Bluetooth sound system with ambient resonance
                                </li>
                              </ul>
                              <p className="mt-3 text-muted-foreground italic">
                                Created for those who value simplicity and a
                                quiet sense of wellness.
                              </p>
                            </div>
                            <div className="pt-6 border-t border-border">
                              <h3 className="text-foreground font-semibold text-lg mb-2">
                                Eirene Sentient Edition
                              </h3>
                              <ul className="list-disc ml-6 space-y-2">
                                <li>Everything in the Base Edition</li>
                                <li>
                                  <strong>AI Sentient Module:</strong> listens
                                  and responds with voice interaction
                                </li>
                                <li>
                                  Personalized guidance for meditation and
                                  affirmations
                                </li>
                                <li>
                                  Adaptive soundscapes that shift with mood,
                                  time, and environment
                                </li>
                              </ul>
                              <p className="mt-3 text-muted-foreground italic">
                                Designed as a more interactive wellness
                                companion.
                              </p>
                            </div>
                          </div>
                        )}
                        {activeTab === "experience" && (
                          <p>
                            The Lumivase Eirene is a piece that restores calm
                            through balance. It brings together natural beauty,
                            crafted design, and sound to create a space of
                            serenity.
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
