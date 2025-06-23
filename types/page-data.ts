import { isPageBlock, type PageBlock } from "./page-blocks";

export type PageData = {
    url: string;
    title: string;
    short_description: string;
    blocks: PageBlock[];

};

export function isPageData(obj: any): obj is PageData {
    return (
        obj !== null &&
        typeof obj === "object" &&
        typeof obj.url === "string" &&
        typeof obj.title === "string" &&
        typeof obj.short_description === "string"
    );
}