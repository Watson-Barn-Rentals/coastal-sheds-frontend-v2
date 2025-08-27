import { isEmployeeItem, type EmployeeItem } from "./employee-item";
import { isImageMediaItem, type ImageMediaItem } from "./image-media-item";
import { isRegionItem, type RegionItem } from "./region-item";

export type LocationItem = {
    heroImage: ImageMediaItem
    slug: string
    title: string
    shortDescription: string
    longDescription: string
    address: string
    city: string
    state: string
    zip: string
    latitude: string
    longitude: string
    phone: string
    email: string
    regions: RegionItem[]
    salesReps: EmployeeItem[]
    googleMapsEmbedUrl: string
    facebookPageUrl: string
    hours: Record<string, string>
}

export function isLocationItem(x: any): x is LocationItem {
  return (
    x !== null &&
    typeof x === "object" &&
    isImageMediaItem(x.heroImage) &&
    typeof x.slug === "string" &&
    typeof x.title === "string" &&
    typeof x.shortDescription === "string" &&
    typeof x.longDescription === "string" &&
    typeof x.address === "string" &&
    typeof x.city === "string" &&
    typeof x.state === "string" &&
    typeof x.zip === "string" &&
    typeof x.latitude === "string" &&
    typeof x.longitude === "string" &&
    typeof x.phone === "string" &&
    typeof x.email === "string" &&
    Array.isArray(x.regions) &&
    x.regions.every(isRegionItem) &&
    Array.isArray(x.salesReps) &&
    x.salesReps.every(isEmployeeItem) &&
    typeof x.googleMapsEmbedUrl === "string" &&
    typeof x.facebookPageUrl === "string" &&
    typeof x.hours === "object"
  );
}