// types/blocks/heading.ts

import { isCustomCssStyling, type CustomCssStyling } from "../custom-css-styling";

export const HEADING_BLOCK_TYPE = "heading" as const;

export type HeadingBlockData = {
  content: string
  headingTextSize: string
  headingFont: string
  headingTextColor: string
  headingLevel: 'h1' | 'h2' | 'h3' | 'p'
  textAlignment: 'left' | 'center'
  topMargin: string
  customTextStyling: CustomCssStyling
};

export type HeadingBlock = {
  type: typeof HEADING_BLOCK_TYPE;
  spaceAfter: string
  data: HeadingBlockData;
};

export function isHeadingBlock(x: any): x is HeadingBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === HEADING_BLOCK_TYPE &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.content === "string" &&
    x.data.headingTextSize === "string" &&
    x.data.headingFont === "string" &&
    x.data.headingTextColor === "string" &&
    (x.data.headingLevel === "h1" || x.data.headingLevel === "h2" || x.data.headingLevel === "h3" || x.data.headingLevel === "p") &&
    typeof x.data.topMargin === "string" &&
    isCustomCssStyling(x.data.customTextStyling) &&
    (x.data.textAlignment === "left" || x.data.textAlignment === "center")
  );
}
