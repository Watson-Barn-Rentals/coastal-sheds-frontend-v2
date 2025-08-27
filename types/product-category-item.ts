import { isImageMediaItem, type ImageMediaItem } from "./image-media-item"
import { isProductLineItem, type ProductLineItem } from "./product-line-item"

export type ProductCategoryItem = {
    heroImage: ImageMediaItem
    additionalImages: ImageMediaItem[]
    slug: string
    title: string
    short_description: string
    long_description: string
    override_page_url: string | null
    product_lines: ProductLineItem[]
}

export function isProductCategoryItem(x: any): x is ProductCategoryItem {
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
    Array.isArray(x.product_lines) &&
    x.product_lines.every(isProductLineItem)
  );
}
