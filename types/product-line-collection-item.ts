import { isProductCategoryCollectionItem, type ProductCategoryCollectionItem } from "./product-category-collection-item";

export type ProductLineCollectionItem = {
    hero: string;
    long_description: string;
    short_description: string;
    page_override_url: string | null;
    slug: string;
    title: string;
    product_category: ProductCategoryCollectionItem;
}

export function isProductLineCollectionItem(item: any): item is ProductLineCollectionItem {
    if (typeof item !== 'object' || item === null) {
        console.error('Item is not an object or is null');
        return false;
    }
    if (typeof item.hero !== 'string') {
        console.error('Item hero is not a string');
        return false;
    }
    if (typeof item.long_description !== 'string') {
        console.error('Item long_description is not a string');
        return false;
    }
    if (typeof item.short_description !== 'string') {
        console.error('Item short_description is not a string');
        return false;
    }
    if (typeof item.page_override_url !== 'string' && item.page_override_url !== null) {
        console.error('Item page_override_url is not a string or null');
        return false;
    }
    if (typeof item.slug !== 'string') {
        console.error('Item slug is not a string');
        return false;
    }
    if (typeof item.title !== 'string') {
        console.error('Item title is not a string');
        return false;
    }
    if (!isProductCategoryCollectionItem(item.product_category)) {
        console.error('Item product_category is not a valid ProductCategoryCollectionItem');
        return false;
    }
    return true;
}