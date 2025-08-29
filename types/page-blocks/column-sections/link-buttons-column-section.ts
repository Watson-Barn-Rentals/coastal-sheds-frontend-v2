// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";

export const LINK_BUTTONS_COLUMN_SECTION_TYPE = "link-buttons-column-section" as const;

export type LinkButtonData = {
  destination: string
  label: string
  iconPresets: 'custom-icon' | 'animated-right-side-arrow'
  iconName: string | null
  customIconStyling: CustomCssStyling
  buttonStyling: string
  trackingEventName: string
}

export type LinkButtonsColumnSectionData = {
  buttonSpacing: 'center' | 'space-between' | 'space-around';
  buttons: LinkButtonData[];
};

export type LinkButtonsColumnSection = {
  type: typeof LINK_BUTTONS_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  mobileOnly: boolean
  spaceAfter: string
  data: LinkButtonsColumnSectionData;
};

export const isLinkButtonData = (x: any): x is LinkButtonData => {
  return (
    x !== null &&
    typeof x === "object" &&
    typeof x.destination === "string" &&
    typeof x.label === "string" &&
    (x.iconPresets === "custom-icon" || x.iconPresets === "animated-right-side-arrow") &&
    (x.iconName === null || typeof x.iconName === "string") &&
    isCustomCssStyling(x.customIconStyling) &&
    typeof x.buttonStyling === "string" &&
    typeof x.trackingEventName === "string"
  );
};

export const isLinkButtonsColumnSection = (x: any): x is LinkButtonsColumnSection => {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === LINK_BUTTONS_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.mobileOnly === "boolean" &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    (x.data.buttonSpacing === "center" ||
      x.data.buttonSpacing === "space-between" ||
      x.data.buttonSpacing === "space-around") &&
    Array.isArray(x.data.buttons) &&
    x.data.buttons.every(isLinkButtonData)
  );
};
