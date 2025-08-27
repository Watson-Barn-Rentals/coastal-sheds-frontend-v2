import { isImageMediaItem, type ImageMediaItem } from "./image-media-item"
import { isProductCategoryItem, type ProductCategoryItem } from "./product-category-item"
import { isProductItem, type ProductItem } from "./product-item"

export type ProductLineItem = {
    heroImage: ImageMediaItem
    additionalImages: ImageMediaItem[]
    slug: string
    title: string
    short_description: string
    long_description: string
    override_page_url: string | null
    products: ProductItem[]
    product_category_slug: string
    product_category_title: string
}

export function isProductLineItem(x: any): x is ProductLineItem {
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
    Array.isArray(x.products) &&
    x.products.every(isProductItem) &&
    typeof x.product_category_slug === "string" &&
    typeof x.product_category_title === "string"
  );
}
