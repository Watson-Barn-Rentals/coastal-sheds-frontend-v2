import { isImageMediaItem, type ImageMediaItem } from "./image-media-item"

export type ProductItem = {
    heroImage: ImageMediaItem
    additionalImages: ImageMediaItem[]
    slug: string
    title: string
    short_description: string
    long_description: string
    override_page_url: string | null
    designer_link: string | null
    starting_price: string | null
    product_line_slug: string
    product_line_title: string
    product_category_slug: string
    product_category_title: string
}

export function isProductItem(x: any): x is ProductItem {
  return (
    x !== null &&
    typeof x === "object" &&
    typeof x.heroImage === "object" &&
    isImageMediaItem(x.heroImage) &&
    Array.isArray(x.additionalImages) &&
    x.additionalImages.every(isImageMediaItem) &&
    typeof x.slug === "string" &&
    typeof x.title === "string" &&
    typeof x.short_description === "string" &&
    typeof x.long_description === "string" &&
    (typeof x.override_page_url === "string" || x.override_page_url === null) &&
    (typeof x.designer_link === "string" || x.designer_link === null) &&
    (typeof x.starting_price === "string" || x.starting_price === null) &&
    typeof x.product_line_slug === "string" &&
    typeof x.product_line_title === "string" &&
    typeof x.product_category_slug === "string" &&
    typeof x.product_category_title === "string"
  );
}
