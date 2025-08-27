export type RegionItem = {
    slug: string
    title: string
    zipCodes: string[]
}

export function isRegionItem(x: any): x is RegionItem {
  return (
    x !== null &&
    typeof x === "object" &&
    typeof x.slug === "string" &&
    typeof x.title === "string" &&
    Array.isArray(x.zipCodes) &&
    x.zipCodes.every((code: unknown) => typeof code === "string")
  );
}
