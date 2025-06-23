import { isHoursItem, type HoursItem } from "./hours-item";

export type LocationCollectionItem = {
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone_number: string;
    hero: string;
    facebook_page_url: string | null;
    google_maps_embed_url: string;
    hours: HoursItem[];
    short_description: string;
    long_description: string;
    slug: string;
    title: string;
}

export function isLocationCollectionItem(item: any): item is LocationCollectionItem {
    if (typeof item !== 'object') {
        console.error('Item is not an object');
        return false;
    }
    if (typeof item.address !== 'string') {
        console.error('Address is not a string');
        return false;
    }
    if (typeof item.city !== 'string') {
        console.error('City is not a string');
        return false;
    }
    if (typeof item.state !== 'string') {
        console.error('State is not a string');
        return false;
    }
    if (typeof item.zip !== 'string') {
        console.error('Zip is not a string');
        return false;
    }
    if (typeof item.email !== 'string') {
        console.error('Email is not a string');
        return false;
    }
    if (typeof item.phone_number !== 'string') {
        console.error('Phone is not a string');
        return false;
    }
    if (typeof item.hero !== 'string') {
        console.error('Hero is not a string');
        return false;
    }
    if (typeof item.facebook_page_url !== 'string' && item.facebook_page_url !== null) {
        console.error('Facebook page URL is not a string or null');
        return false;
    }
    if (typeof item.google_maps_embed_url !== 'string') {
        console.error('Google Maps URL is not a string');
        return false;
    }
    if (!Array.isArray(item.hours)) {
        console.error('Hours is not an array');
        return false;
    }
    if (!item.hours.every((hour: any) => isHoursItem(hour))) {
        console.error('One or more hours items are invalid');
        return false;
    }
    if (typeof item.short_description !== 'string') {
        console.error('Short description is not a string');
        return false;
    }
    if (typeof item.long_description !== 'string') {
        console.error('Long description is not a string');
        return false;
    }
    if (typeof item.slug !== 'string') {
        console.error('Slug is not a string');
        return false;
    }
    if (typeof item.title !== 'string') {
        console.error('Title is not a string');
        return false;
    }
    return true;
}