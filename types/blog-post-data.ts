import { isImageMediaItem, type ImageMediaItem } from "./image-media-item";
import { isPageBlock, type PageBlock } from "./page-blocks";

export type BlogPostData = {
  heroImage: ImageMediaItem | null;
  slug: string;
  title: string;
  short_description: string;
  published_at: string;
  updated_at: string;
  blocks: PageBlock[];
  relatedBlogPosts?: BlogPostData[];
};

export function isBlogPostData(obj: unknown): obj is BlogPostData {
  if (obj === null || typeof obj !== "object") return false;

  const o = obj as Partial<BlogPostData>;

  // basic fields
  if (!(
    (o.heroImage === null || isImageMediaItem(o.heroImage)) &&
    typeof o.slug === "string" &&
    typeof o.title === "string" &&
    typeof o.short_description === "string" &&
    typeof o.published_at === "string" &&
    typeof o.updated_at === "string" &&
    Array.isArray(o.blocks) &&
    o.blocks.every(isPageBlock)
  )) {
    return false;
  }

  // relatedBlogPosts: optional, but if present must be an array of BlogPostData
  if (o.relatedBlogPosts === undefined) return true;

  return Array.isArray(o.relatedBlogPosts)
    && o.relatedBlogPosts.every(isBlogPostData);
}
