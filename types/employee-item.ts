import { isImageMediaItem, type ImageMediaItem } from "./image-media-item";

export type EmployeeItem = {
    profilePicture: ImageMediaItem
    name: string
    title: string
    bio: string
}

export function isEmployeeItem(x: any): x is EmployeeItem {
  return (
    x !== null &&
    typeof x === "object" &&
    isImageMediaItem(x.profilePicture) &&
    typeof x.name === "string" &&
    typeof x.title === "string" &&
    typeof x.bio === "string"
  );
}
