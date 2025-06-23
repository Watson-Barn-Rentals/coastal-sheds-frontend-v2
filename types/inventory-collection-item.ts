import { isLocationCollectionItem, type LocationCollectionItem } from "./location-collection-item";
import { isProductCollectionItem, type ProductCollectionItem } from "./product-collection-item";

export type InventoryCollectionItem = {
    cash_price: string;
    discount_amount: string | null;
    description: string;
    is_used_building: boolean;
    roof_color: string;
    siding_color: string;
    trim_color: string;
    size: string;
    serial_number: string;
    product: ProductCollectionItem;
    location: LocationCollectionItem;
    images: string[];
}

export function isInventoryCollectionItem(item: any): item is InventoryCollectionItem {
    if (typeof item !== 'object' || item === null) {
        console.error('isInventoryCollectionItem: item is not an object or is null');
        return false;
    }
    if (typeof item.cash_price !== 'string') {
        console.error('isInventoryCollectionItem: cash_price is not a string');
        return false;
    }
    if (typeof item.discount_amount !== 'string' && item.discount_amount !== null) {
        console.error('isInventoryCollectionItem: discount_amount is not a string or null');
        return false;
    }
    if (typeof item.description !== 'string') {
        console.error('isInventoryCollectionItem: description is not a string');
        return false;
    }
    if (typeof item.is_used_building !== 'boolean') {
        console.error('isInventoryCollectionItem: is_used_building is not a boolean');
        return false;
    }
    if (typeof item.roof_color !== 'string') {
        console.error('isInventoryCollectionItem: roof_color is not a string');
        return false;
    }
    if (typeof item.siding_color !== 'string') {
        console.error('isInventoryCollectionItem: siding_color is not a string');
        return false;
    }
    if (typeof item.trim_color !== 'string') {
        console.error('isInventoryCollectionItem: trim_color is not a string');
        return false;
    }
    if (typeof item.size !== 'string') {
        console.error('isInventoryCollectionItem: size is not a string');
        return false;
    }
    if (typeof item.serial_number !== 'string') {
        console.error('isInventoryCollectionItem: serial_number is not a string');
        return false;
    }
    if (!isProductCollectionItem(item.product)) {
        console.error('isInventoryCollectionItem: product is not a valid ProductCollectionItem');
        return false;
    }
    if (!isLocationCollectionItem(item.location)) {
        console.error('isInventoryCollectionItem: location is not a valid LocationCollectionItem');
        return false;
    }
    if (!Array.isArray(item.images) || !item.images.every((img: any) => typeof img === 'string')) {
        console.error('isInventoryCollectionItem: images is not an array of strings');
        return false;
    }
    return true;
}