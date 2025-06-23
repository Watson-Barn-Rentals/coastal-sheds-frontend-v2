export type HoursItem = {
    day: string;
    hours: string;
}

export function isHoursItem(obj: any): obj is HoursItem {
    if (typeof obj !== 'object') {
        console.error('Validation failed: obj is not an object');
        return false;
    }
    if (typeof obj.day !== 'string') {
        console.error('Validation failed: obj.day is not a string');
        return false;
    }
    if (typeof obj.hours !== 'string') {
        console.error('Validation failed: obj.hours is not a string');
        return false;
    }
    return true;
}