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

export type MessageTemplateDataSchemaProperty = {
  key: string;
  name: string;
  type: 'string' | 'image' | 'action';
};

export type MessageTemplateCategory = {
  id: number;
  name: string;
  is_default: boolean;
};

export type MessageTemplateItem = ComponentsUnion['properties'];

export type MessageTemplateData = {
  key: string;
  variables: Record<string, any>;
};

export type SendbirdMessageTemplate = {
  key: string;
  name: string;
  category?: MessageTemplateCategory | string;
  label?: string;
  status: 'active' | 'archived';
  data_schema: { properties: MessageTemplateDataSchemaProperty[] };
  ui_template: {
    version: number;
    body: {
      items: MessageTemplateItem[];
    };
  };
  color_variables: Record<string, string>;
  enable_push: boolean;
  fallback_message: string | null;
  push_template: {
    title: string;
    body: string;
  };
  // channel: GroupChannel;
  created_at: number;
  updated_at: number;
};
