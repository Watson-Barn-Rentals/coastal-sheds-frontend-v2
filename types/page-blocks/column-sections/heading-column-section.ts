// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";

export const HEADING_COLUMN_SECTION_TYPE = "heading-column-section" as const;

export type HeadingColumnSectionData = {
  text: string
  headingFont: string
  headingTextSize: string
  headingTextColor: string
  headingLevel: 'h1' | 'h2' | 'h3' | 'p'
  textAlignment: 'center' | 'left'
  customTextStyling: CustomCssStyling
};

export type HeadingColumnSection = {
  type: typeof HEADING_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  mobileOnly: boolean
  spaceAfter: string
  data: HeadingColumnSectionData;
};

export function isHeadingColumnSection(x: any): x is HeadingColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === HEADING_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.mobileOnly === "boolean" &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.text === "string" &&
    typeof x.data.headingFont === "string" &&
    typeof x.data.headingTextSize === "string" &&
    typeof x.data.headingTextColor === "string" &&
    (x.data.headingLevel === "h1" ||
      x.data.headingLevel === "h2" ||
      x.data.headingLevel === "h3" ||
      x.data.headingLevel === "p") &&
    (x.data.textAlignment === "center" || x.data.textAlignment === "left") &&
    isCustomCssStyling(x.data.customTextStyling)
  );
}
