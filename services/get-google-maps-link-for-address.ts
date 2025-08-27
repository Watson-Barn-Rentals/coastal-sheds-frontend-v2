export const getGoogleMapsLinkForAddress = (address: string, city: string, state: string, zip: string): string => {
    const formattedAddress = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`);
    return `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
}