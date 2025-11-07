import type { Product } from "@/app/types"; // Adjusted path to match your project

export const mockProductData: { [key: string]: Product } = {
  atheris: {
    _id: "product_atheris_001",
    name: "Atheris",
    price: 1200000,
    stock: 12,
    category: { name: "Seating" },
    images: [
      {
        _id: "img_ath_1",
        url: "/products/atheris/image1.jpg",
        isMain: true,
        styleName: "Front View",
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
    name: "B'elysium",
    price: 2800000,
    stock: 7,
    category: { name: "Bedroom" },
    images: [
      {
        _id: "img_bel_1",
        url: "/products/belysium/image1.jpg",
        isMain: true,
        styleName: "B'ELYSIUM WALNUT BROWN",
      },
      {
        _id: "img_bel_2",
        url: "/products/belysium/image2.jpg",
        isMain: false,
        styleName: "Walnut Brown Detail",
      },
      {
        _id: "img_bel_3",
        url: "/products/belysium/image3.jpg",
        isMain: false,
        styleName: "Walnut Brown In Context",
      },
    ],
  },
  lumivase: {
    _id: "product_lumivase_003",
    name: "Lumivase",
    price: 850000,
    stock: 25,
    category: { name: "Lighting & Decor" },
    images: [
      {
        _id: "img_lum_1",
        url: "/products/lumivase/image1.jpg",
        isMain: true,
        styleName: "Full View",
      },
      {
        _id: "img_lum_2",
        url: "/products/lumivase/image2.jpg",
        isMain: false,
        styleName: "Crystal Detail",
      },
      {
        _id: "img_lum_3",
        url: "/products/lumivase/image3.jpg",
        isMain: false,
        styleName: "Base Detail",
      },
    ],
  },
};
