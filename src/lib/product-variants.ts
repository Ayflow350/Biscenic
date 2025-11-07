export interface Variant {
  displayName: string;
  imageId: string;
}

export const productVariants: { [key: string]: Variant[] } = {
  "B'elysium": [
    {
      displayName: "B'ELYSIUM WALNUT BROWN",
      imageId: "img_bel_1",
    },
    {
      displayName: "B'ELYSIUM NIGHT",
      imageId: "img_bel_4",
    },
  ],
};
