// types/blocks/columns-section.ts

import { isCustomCssStyling, type CustomCssStyling } from "../custom-css-styling";
import { isColumnSection, type ColumnSection } from "./columns-section-index";

export const COLUMNS_SECTION_PAGE_BLOCK_TYPE = "columns-section" as const;

export type ColumnGroup = {
  groupNumber: number;
  columns: Column[];
};

export type Column = {
  width: string;
  groupNumber: number;
  columnCustomStyling: CustomCssStyling;
  columnSections: ColumnSection[];
};

export type ColumnsSectionPageBlockData = {
  columnLayoutWidth: "screen" | "standard-max-width";
  pageBlockBackgroundOption: "none" | "color_background" | "image_background" | "video_background";
  pageBlockBackgroundColor: string | null;
  pageBlockBackgroundImageUrl: string | null;
  pageBlockBackgroundVideoUrl: string | null;
  pageBlockPaddingTop: string;
  pageBlockPaddingBottom: string;
  pageBlockPaddingLeft: string;
  pageBlockPaddingRight: string;
  fadeTopAndBottomOfPageBlock: boolean;
  pageBlockCustomStyling: CustomCssStyling;
  contentAreaPaddingTop: string;
  contentAreaPaddingBottom: string;
  contentAreaPaddingLeft: string;
  contentAreaPaddingRight: string;
  contentAreaCornerRadius: string;
  contentAreaBackgroundFilter: string;
  contentAreaBackgroundColor: string | null;
  contentAreaTextColor: string;
  contentAreaCustomStyling: CustomCssStyling;
  columnGroups: ColumnGroup[];
};

export type ColumnsSectionPageBlock = {
  type: typeof COLUMNS_SECTION_PAGE_BLOCK_TYPE;
  spaceAfter: string;
  data: ColumnsSectionPageBlockData;
};

/* ---------- helpers ---------- */
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isString = (v: unknown): v is string => typeof v === "string";
const isNullableString = (v: unknown): v is string | null =>
  v === null || typeof v === "string";
const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const isOneOf = <T extends readonly string[]>(
  v: unknown,
  list: T
): v is T[number] => typeof v === "string" && (list as readonly string[]).includes(v);

/* ---------- leaf guards ---------- */
export const isColumn = (item: unknown): item is Column =>
  isRecord(item) &&
  isString(item.width) &&
  isCustomCssStyling(item.columnCustomStyling) &&
  isFiniteNumber(item.groupNumber) &&
  Array.isArray(item.columnSections) &&
  item.columnSections.every(isColumnSection);

export const isColumnGroup = (item: unknown): item is ColumnGroup =>
  isRecord(item) &&
  isFiniteNumber(item.groupNumber) &&
  Array.isArray(item.columns) &&
  item.columns.every(isColumn);

/* ---------- data guard ---------- */
export const isColumnsSectionPageBlockData = (item: unknown): item is ColumnsSectionPageBlockData => {
  if (!isRecord(item)) return false;

  if (!isOneOf(item.columnLayoutWidth, ["screen", "standard-max-width"] as const)) return false;
  if (
    !isOneOf(item.pageBlockBackgroundOption, [
      "none",
      "color_background",
      "image_background",
      "video_background",
    ] as const)
  ) return false;

  if (!isNullableString(item.pageBlockBackgroundColor)) return false;
  if (!isNullableString(item.pageBlockBackgroundImageUrl)) return false;
  if (!isNullableString(item.pageBlockBackgroundVideoUrl)) return false;

  const stringKeys: Array<keyof ColumnsSectionPageBlockData> = [
    "pageBlockPaddingTop",
    "pageBlockPaddingBottom",
    "pageBlockPaddingLeft",
    "pageBlockPaddingRight",
    "contentAreaPaddingTop",
    "contentAreaPaddingBottom",
    "contentAreaPaddingLeft",
    "contentAreaPaddingRight",
    "contentAreaCornerRadius",
    "contentAreaBackgroundFilter",
    "contentAreaTextColor",
  ];
  for (const k of stringKeys) {
    if (!isString((item as any)[k])) return false;
  }

  if (typeof item.fadeTopAndBottomOfPageBlock !== "boolean") return false;
  if (!isNullableString(item.contentAreaBackgroundColor)) return false;

  if (!isCustomCssStyling(item.pageBlockCustomStyling)) return false;
  if (!isCustomCssStyling(item.contentAreaCustomStyling)) return false;

  if (!Array.isArray(item.columnGroups)) return false;
  if (!item.columnGroups.every(isColumnGroup)) return false;

  return true;
};

/* ---------- full block guard ---------- */
export const isColumnsSectionBlock = (x: unknown): x is ColumnsSectionPageBlock => {
  if (!isRecord(x)) return false;
  if (x.type !== COLUMNS_SECTION_PAGE_BLOCK_TYPE) return false;
  if (!isString(x.spaceAfter)) return false;

  const data = (x as any).data;
  return isColumnsSectionPageBlockData(data);
};
