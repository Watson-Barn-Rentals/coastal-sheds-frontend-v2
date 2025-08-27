// types/blocks/columns-section.ts

import type { ColumnSection } from "./columns-section-index";

export const COLUMNS_SECTION_PAGE_BLOCK_TYPE = "columns-section" as const;

export type ColumnsSectionPageBlockData = {
  columnLayoutWidth: "screen" | "standard-max-width";
  columns: Array<{
    width: string;
    columnSections: ColumnSection[];
  }>;
};

export type ColumnsSectionPageBlock = {
  type: typeof COLUMNS_SECTION_PAGE_BLOCK_TYPE;
  spaceAfter: string
  data: ColumnsSectionPageBlockData;
};

export function isColumnsSectionBlock(x: unknown): x is ColumnsSectionPageBlock {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const isBlock = (v: unknown): v is { type: string; data: Record<string, unknown> } =>
    isRecord(v) && typeof (v as any).type === "string" && isRecord((v as any).data);

  // Narrower alias so the ColumnSection import is used
  const isColumnSection = (v: unknown): v is ColumnSection => isBlock(v);

  if (!isRecord(x)) return false;
  if ((x as any).type !== COLUMNS_SECTION_PAGE_BLOCK_TYPE) return false;

  if (typeof (x as any).spaceAfter !== "string") return false;

  const data = (x as any).data;
  if (!isRecord(data)) return false;

  const layout = (data as any).columnLayoutWidth;
  if (layout !== "screen" && layout !== "standard-max-width") return false;

  const columns = (data as any).columns;
  if (!Array.isArray(columns)) return false;

  return columns.every((col: unknown) => {
    if (!isRecord(col)) return false;
    if (typeof (col as any).width !== "string") return false;

    const sections = (col as any).columnSections;
    if (!Array.isArray(sections)) return false;

    return sections.every(isColumnSection);
  });
}
