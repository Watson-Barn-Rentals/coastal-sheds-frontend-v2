import { isProductLineCollectionItem, type ProductLineCollectionItem } from "./product-line-collection-item";

export type ProductCollectionItem = {
    hero: string;
    long_description: string;
    short_description: string;
    page_override_url: string | null;
    slug: string;
    title: string;
    product_line: ProductLineCollectionItem;
};

export function isProductCollectionItem(item: any): item is ProductCollectionItem {
    if (typeof item !== 'object' || item === null) {
        console.error('Item is not an object or is null');
        return false;
    }
    if (typeof item.hero !== 'string') {
        console.error('hero is not a string');
        return false;
    }
    if (typeof item.long_description !== 'string') {
        console.error('long_description is not a string');
        return false;
    }
    if (typeof item.short_description !== 'string') {
        console.error('short_description is not a string');
        return false;
    }
    if (typeof item.page_override_url !== 'string' && item.page_override_url !== null) {
        console.error('page_override_url is not a string or null');
        return false;
    }
    if (typeof item.slug !== 'string') {
        console.error('slug is not a string');
        return false;
    }
    if (typeof item.title !== 'string') {
        console.error('title is not a string');
        return false;
    }
    if (!isProductLineCollectionItem(item.product_line)) {
        console.error('product_line is not a valid ProductLineCollectionItem');
        return false;
    }
    return true;
}