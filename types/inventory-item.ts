import { isImageMediaItem, type ImageMediaItem } from "./image-media-item"
import { isLocationItem, type LocationItem } from "./location-item"
import { isProductItem, type ProductItem } from "./product-item"

export type InventoryItem = {
    heroImage: ImageMediaItem
    additionalImages: ImageMediaItem[]
    serialNumber: string
    lotNumber: string | null
    location: LocationItem
    product: ProductItem
    size: string
    usedBuilding: boolean
    cashPrice: number
    discountAmount: number | null
    roofColor: string
    sidingColor: string
    trimColor: string
    description: string
    highlightedLabel: string | null
    highlightedDescription: string | null
    designerLink: string | null
}

export function isInventoryItem(x: any): x is InventoryItem {
  return (
    x !== null &&
    typeof x === "object" &&
    typeof x.heroImage === "object" &&
    isImageMediaItem(x.heroImage) &&
    Array.isArray(x.additionalImages) &&
    x.additionalImages.every(isImageMediaItem) &&
    typeof x.serialNumber === "string" &&
    (typeof x.lotNumber === "string" || x.lotNumber === null) &&
    isLocationItem(x.location) &&
    isProductItem(x.product) &&
    typeof x.size === "string" &&
    typeof x.usedBuilding === "boolean" &&
    typeof x.cashPrice === "number" &&
    (typeof x.discountAmount === "number" || x.discountAmount === null) &&
    typeof x.roofColor === "string" &&
    typeof x.sidingColor === "string" &&
    typeof x.trimColor === "string" &&
    typeof x.description === "string" &&
    (typeof x.highlightedLabel === "string" || x.highlightedLabel === null) &&
    (typeof x.highlightedDescription === "string" || x.highlightedDescription === null) &&
    (typeof x.designerLink === "string" || x.designerLink === null)
  );
}
