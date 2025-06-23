export type ImageMediaItem = {
    original_url: string;
    srcset: string;
    placeholder: string;
    width: number;
    height: number;
    alt: string;
}

export function isImageMediaItem(x: any): x is ImageMediaItem {
    return (
        x !== null &&
        typeof x === "object" &&
        typeof x.original_url === "string" &&
        typeof x.srcset === "string" &&
        typeof x.placeholder === "string" &&
        typeof x.width === "number" &&
        typeof x.height === "number" &&
        typeof x.alt === "string"
    );
}