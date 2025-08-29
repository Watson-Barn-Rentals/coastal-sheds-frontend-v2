// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";

export const SPACER_COLUMN_SECTION_TYPE = "spacer-column-section" as const;

export type SpacerColumnSectionData = {
  height: string
};

export type SpacerColumnSection = {
  type: typeof SPACER_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  mobileOnly: boolean
  spaceAfter: string
  data: SpacerColumnSectionData;
};

export function isSpacerColumnSection(x: any): x is SpacerColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === SPACER_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.mobileOnly === "boolean" &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.height === "string"
  );
}
