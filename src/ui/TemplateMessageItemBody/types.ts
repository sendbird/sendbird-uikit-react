import { ComponentsUnion, CompositeComponentType } from '@sendbird/uikit-message-template';

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

export type MessageTemplateItem = ComponentsUnion['properties'];

export type FilledMessageTemplate = {
  version: number,
  body: {
    items: MessageTemplateItem[];
  },
};

export interface CarouselItem {
  type: CompositeComponentType.Carousel;
  spacing: number;
  items: string | SendbirdUiTemplate[]; // Reservation key. ex. "{@some_key}"
}

export type MessageTemplateData = SimpleTemplateData & {
  // Reference: https://sendbird.atlassian.net/wiki/spaces/UK/pages/2265484095/UIKit+message+template+syntax+extension+proposal#View-variables-in-message-payload
  view_variables?: Record<string, SimpleTemplateData[]>;
  // Ref: https://sendbird.atlassian.net/wiki/spaces/UK/pages/2476900424/Refactor+MessageTemplateView#extended_message_payload.message_template
  container_options?: {
    profile?: boolean; // default is true
    time?: boolean; // default is true
    nickname?: boolean; // default is true
  };
};

export type TemplateType = 'default';

export type SimpleTemplateData = {
  type?: TemplateType;
  key: string;
  variables?: Record<string, any>;
};

export interface SendbirdUiTemplate {
  version: number;
  body: {
    items: MessageTemplateItem[];
  };
}

export type SendbirdMessageTemplate = {
  key: string;
  created_at: number;
  updated_at: number;
  ui_template: SendbirdUiTemplate;
  name?: string;
  color_variables?: Record<string, string>;
};
