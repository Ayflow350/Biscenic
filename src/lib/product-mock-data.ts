import type { Product } from "@/app/types";

// NOTE: Ensure your ProductImage type in "@/app/types" is updated:
// export type ProductImage = {
//   // ... existing properties
//   displayNameOverride?: string; // <-- Must be present in the type
// };

export const mockProductData: { [key: string]: Product } = {
  atheris: {
    _id: "product_atheris_001",
    name: "Atheris", // Base name
    price: 1200000,
    stock: 12,
    category: { name: "Seating" },
    images: [
      {
        _id: "img_ath_1",
        url: "/products/atheris/image1.jpg",
        isMain: true,
        styleName: "Front View",
        // No displayNameOverride needed, will use base "Atheris"
      },
      {
        _id: "img_ath_2",
        url: "/products/atheris/image2.jpg",
        isMain: false,
        styleName: "Side Angle",
      },
      {
        _id: "img_ath_3",
        url: "/products/atheris/image3.jpg",
        isMain: false,
        styleName: "In Context",
      },
      {
        _id: "img_ath_4",
        url: "/products/atheris/image4.jpg",
        isMain: false,
        styleName: "Back Angle",
      },
      {
        _id: "img_ath_5",
        url: "/products/atheris/image5.jpg",
        isMain: false,
        styleName: "Detail",
      },
    ],
  },
  belysium: {
    _id: "product_belysium_002",
    name: "B'elysium", // Base name (e.g., if no variant is selected)
    price: 20000,
    stock: 7,
    category: { name: "Bedroom" },
    images: [
      {
        _id: "img_bel_1",
        url: "/products/belysium/image1.jpg",
        isMain: true,
        styleName: "B'ELYSIUM WALNUT BROWN",
        // ADDED: Override the display name for the header when this image is active
        displayNameOverride: "B'elysium ",
      },
      {
        _id: "img_bel_2",
        url: "/products/belysium/image2.jpg",
        isMain: false,
        styleName: "Walnut Brown Detail",
        // ADDED: Use the same override name for all images of this variant
        displayNameOverride: "B'elysium Night Edition",
      },
      {
        _id: "img_bel_3",
        url: "/products/belysium/image3.jpg",
        isMain: false,
        styleName: "Walnut Brown In Context",
        // ADDED: Use the same override name for all images of this variant
        displayNameOverride: "B'elysium Walnut Brown",
      },

      /*
      {
        _id: "img_bel_4_night",
        url: "/products/belysium/image4_night.jpg",
        isMain: false,
        styleName: "B'ELYSIUM NIGHT",
        displayNameOverride: "B'elysium Night", // New variant name
      },
      */
    ],
  },
  lumivase: {
    _id: "product_lumivase_003",
    name: "Ivory Silence",
    price: 20000,
    stock: 25,
    category: { name: "Lighting & Decor" },
    images: [
      {
        _id: "img_lum_1",
        url: "/products/lumivase/image1.jpg",
        isMain: true,
        styleName: "Full View",
        // If this product also has variants that change the name, you'd add:
        displayNameOverride: "Eirene",
      },
      {
        _id: "img_lum_3",
        url: "/products/lumivase/image3.jpg",
        isMain: false,
        styleName: "Base Detail",
        displayNameOverride: "Eclipsera",
      },
      {
        _id: "img_lum_2",
        url: "/products/lumivase/image2.jpg",
        isMain: false,
        styleName: "Ivory Silence",
      },
      {
        _id: "img_lum_4",
        url: "/products/lumivase/image4.png",
        isMain: false,
        styleName: "Base Detail",
        displayNameOverride: "Crimson",
      },
    ],
  },
};
