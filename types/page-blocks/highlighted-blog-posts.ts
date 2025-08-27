
import { isBlogPostData, type BlogPostData } from "../blog-post-data";
import { isCustomCssStyling, type CustomCssStyling } from "../custom-css-styling";

export const HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE = "highlighted-blog-posts" as const;

export type HighlightedBlogPostsData = {
  blogPosts: BlogPostData[]
};

export type HighlightedBlogPostsBlock = {
  type: typeof HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE;
  spaceAfter: string
  data: HighlightedBlogPostsData;
};

export function isHighlightedBlogPostsBlock(x: any): x is HighlightedBlogPostsBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    Array.isArray(x.data.blogPosts) &&
    x.data.blogPosts.every(isBlogPostData)
  );
}
