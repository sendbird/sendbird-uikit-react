export enum Layout {
  Row = 'row',
  Column = 'column',
}

export enum AlignValue {
  Center = 'center',

  Left = 'left',
  Right = 'right',

  Top = 'top',
  Bottom = 'bottom',
}

export enum FlexSizeSpecValue {
  FillParent,
  WrapContent,
}

export enum FontWeight {
  Normal = 'normal',
  Bold = 'bold',
}

export enum MediaContentMode {
  AspectFit = 'aspectFit',
  AspectFill = 'aspectFill',
  ScalesToFill = 'scalesToFill',
}

export type SizeSpec =
  | {
      type: 'fixed';
      value: number;
    }
  | {
      type: 'flex';
      value: FlexSizeSpecValue;
    };

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Align {
  horizontal: AlignValue.Left | AlignValue.Center | AlignValue.Right;
  vertical: AlignValue.Top | AlignValue.Center | AlignValue.Bottom;
}

// Styles
export interface ViewStyle {
  backgroundColor?: `#${string}`;
  backgroundImageUrl?: string;
  borderWidth?: number;
  borderColor?: `#${string}`;
  radius?: number;
  margin?: Margin;
  padding?: Padding;
}

export interface TextStyle {
  size?: number;
  color?: `#${string}`;
  weight?: FontWeight | number;
}

export interface ImageStyle {
  contentMode?: MediaContentMode;
}

export interface ImageMetaData {
  pixelWidth: number;
  pixelHeight: number;
}
