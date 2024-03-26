import type { ComponentsUnion } from '@sendbird/uikit-message-template';

type SendbirdFontWeight = 'bold' | 'normal';

/**
 * The value of each theme property contains both light and dark value with comma separated string
 * ex)
 * {
 *   ...
 *   backgroundColor: "#800000FF, #20FFFFTT" // lgiht , dark with ARGB 8-digit hexacode
 *   ....
 * }
 *  */
export type MessageTemplateTheme = {
  key: string;
  notification: {
    backgroundColor: string;
    label?: {
      textColor: string;
      textSize: number;
      fontWeight?: SendbirdFontWeight;
    };
    category?: {
      textColor: string;
      textSize: number;
      fontWeight?: SendbirdFontWeight;
    };
    pressedColor: string;
    radius: number;
    sentAt: {
      textColor: string;
      textSize: number;
      fontWeight?: SendbirdFontWeight;
    };
    unreadIndicatorColor: string;
  };
  list: {
    backgroundColor: string;
    category: {
      textSize: number;
      fontWeight: SendbirdFontWeight;
      radius: number;
      backgroundColor: string;
      textColor: string;
      selectedBackgroundColor: string;
      selectedTextColor: string;
    };
    timeline: {
      backgroundColor: string;
      textColor: string;
      textSize?: number;
      fontWeight?: SendbirdFontWeight;
    };
    tooltip: {
      backgroundColor: string;
      textColor: string;
      textSize?: number;
      fontWeight?: SendbirdFontWeight;
    };
  };
  header: {
    backgroundColor: string;
    buttonIconTintColor: string;
    lineColor: string;
    textColor: string;
    textSize: number;
    fontWeight?: SendbirdFontWeight;
  };
  // marked as optional because this is not used for now
  components?: {
    text: {
      textColor: string;
    };
    textButton: {
      textColor: string;
      backgroundColor: string;
      radius: number;
    };
  };
};

export type MessageTemplateItem = ComponentsUnion['properties'] | CarouselItem;
export interface CarouselItem {
  type: string;
  spacing: number;
  items: string; // Reservation key. ex. "{@some_key}"
}

// FIXME: This needs to be updated in the future.
export type MessageTemplateData = SimpleTemplateData & {
  view_variables?: Record<string, SimpleTemplateData[]>; // Reference: https://sendbird.atlassian.net/wiki/spaces/UK/pages/2265484095/UIKit+message+template+syntax+extension+proposal#View-variables-in-message-payload
};

export type SimpleTemplateData = {
  key: string;
  variables?: Record<string, any>;
};

export type SendbirdMessageTemplate = {
  key: string;
  created_at: number;
  updated_at: number;
  ui_template: {
    version: number;
    body: {
      items: MessageTemplateItem[];
    };
  };
  name?: string;
  color_variables?: Record<string, string>;
};
