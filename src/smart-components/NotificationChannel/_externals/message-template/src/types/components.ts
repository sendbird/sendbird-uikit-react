import type React from 'react';

import type { Action } from './properties';
import type {
  Align,
  ImageStyle,
  Layout,
  SizeSpec,
  TextStyle,
  ViewStyle,
  ImageMetaData,
} from './styles';

export type BasicProps<T, ParsedProperties> = React.PropsWithChildren<{ parsedProperties?: ParsedProperties } & T>;

export type GetProperties<Type extends ComponentType, U extends ComponentsUnion> = U extends {
  type: Type;
  properties: infer P;
}
  ? P
  : never;

export type ComponentsUnion =
  | {
      type: ComponentType.Box;
      properties: Box;
    }
  | {
      type: ComponentType.Text;
      properties: Text;
    }
  | {
      type: ComponentType.Image;
      properties: Image;
    }
  | {
      type: ComponentType.TextButton;
      properties: TextButton;
    }
  | {
      type: ComponentType.ImageButton;
      properties: ImageButton;
    };

export enum ComponentType {
  Box = 'box',
  Text = 'text',
  Image = 'image',
  TextButton = 'textButton',
  ImageButton = 'imageButton',
}

export interface View {
  type: ComponentType;
  action?: Action;
  width?: SizeSpec;
  height?: SizeSpec;
  viewStyle?: ViewStyle;
}

export interface Box extends View {
  type: ComponentType.Box;
  layout?: Layout;
  align?: Align;
  items?: ComponentsUnion['properties'][]; // default align "center"
}

export interface Text extends View {
  type: ComponentType.Text;
  text: string;
  maxTextLines?: number; // default: undefined
  align?: Align;
  textStyle?: TextStyle;
}

export interface Image extends View {
  type: ComponentType.Image;
  imageUrl: string;
  imageStyle?: ImageStyle;
  metaData?: ImageMetaData;
}

export interface TextButton extends View {
  type: ComponentType.TextButton;
  text: string;
  maxTextLines?: number; // default: 1
  textStyle?: TextStyle;
}

export interface ImageButton extends View {
  type: ComponentType.ImageButton;
  imageUrl: string;
  imageStyle?: ImageStyle;
  metaData?: ImageMetaData
}
