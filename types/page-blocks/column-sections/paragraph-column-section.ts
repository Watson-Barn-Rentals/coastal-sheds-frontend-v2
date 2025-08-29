// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";

export const PARAGRAPH_COLUMN_SECTION_TYPE = "paragraph-column-section" as const;

export type ParagraphColumnSectionData = {
  text: string
  bodyTextColor: string
  bodyTextSize: string
  bodyFont: string
  bodyCustomStyling: CustomCssStyling
  textAlignment: 'center' | 'left'
};

export type ParagraphColumnSection = {
  type: typeof PARAGRAPH_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  mobileOnly: boolean
  spaceAfter: string
  data: ParagraphColumnSectionData;
};

export function isParagraphColumnSection(x: any): x is ParagraphColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === PARAGRAPH_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.mobileOnly === "boolean" &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.text === "string" &&
    typeof x.data.bodyFont === "string" &&
    typeof x.data.bodyTextSize === "string" &&
    typeof x.data.bodyTextColor === "string" &&
    isCustomCssStyling(x.data.bodyCustomStyling) &&
    (x.data.textAlignment === "center" || x.data.textAlignment === "left")
  );
}
