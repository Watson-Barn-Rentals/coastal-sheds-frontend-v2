// types/blocks/coastal-home-page-hero.ts

export const PARAGRAPH_COLUMN_SECTION_TYPE = "paragraph-column-section" as const;

export type ParagraphColumnSectionData = {
  text: string
  textAlignment: 'center' | 'left'
};

export type ParagraphColumnSection = {
  type: typeof PARAGRAPH_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  spaceAfter: string
  data: ParagraphColumnSectionData;
};

export function isParagraphColumnSection(x: any): x is ParagraphColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === PARAGRAPH_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.text === "string" &&
    (x.data.textAlignment === "center" || x.data.textAlignment === "left")
  );
}
