import {
  Align,
  AlignValue,
  FlexSizeSpecValue,
  ImageMetaData,
  ImageStyle,
  Layout,
  MediaContentMode,
  TextStyle,
  ViewStyle,
} from '../../../message-template/src/types/styles';
import { Image, ImageButton, View } from '../../../message-template/src/types/components';

export type ReactParsedProperties = Record<string, string | number>;

export function getDefaultStyles(overrides?: ReactParsedProperties): ReactParsedProperties {
  return {
    display: 'flex',
    overflow: 'hidden',
    ...overrides,
  };
}

export function setViewProps(styles: ReactParsedProperties, view: View) {
  setViewSize(styles, view);
  setViewStyle(styles, view.viewStyle);
}

export function setViewStyle(styles: ReactParsedProperties, viewStyle?: ViewStyle) {
  if (viewStyle?.padding?.top) styles['paddingTop'] = viewStyle.padding.top;
  if (viewStyle?.padding?.bottom) styles['paddingBottom'] = viewStyle.padding.bottom;
  if (viewStyle?.padding?.left) styles['paddingLeft'] = viewStyle.padding.left;
  if (viewStyle?.padding?.right) styles['paddingRight'] = viewStyle.padding.right;

  if (viewStyle?.margin?.top) styles['marginTop'] = viewStyle.margin.top;
  if (viewStyle?.margin?.bottom) styles['marginBottom'] = viewStyle.margin.bottom;
  if (viewStyle?.margin?.left) styles['marginLeft'] = viewStyle.margin.left;
  if (viewStyle?.margin?.right) styles['marginRight'] = viewStyle.margin.right;

  if (viewStyle?.backgroundColor) styles['backgroundColor'] = viewStyle.backgroundColor;
  if (viewStyle?.backgroundImageUrl) styles['backgroundImageUrl'] = viewStyle.backgroundImageUrl;
  if (viewStyle?.radius) styles['borderRadius'] = viewStyle.radius;
  if (viewStyle?.borderWidth) styles['borderWidth'] = viewStyle.borderWidth;
  if (viewStyle?.borderColor) styles['borderColor'] = viewStyle.borderColor;
}

export function setViewSize(styles: ReactParsedProperties, view: View) {
  {
    const { type = 'flex', value = FlexSizeSpecValue.FillParent } = view.width ?? {};
    if (type === 'flex' && value === FlexSizeSpecValue.FillParent) styles['flex'] = 1;
    if (type === 'fixed' && value) styles['width'] = value;
  }

  {
    const { type = 'flex', value = FlexSizeSpecValue.WrapContent } = view.height ?? {};
    if (type === 'flex' && value === FlexSizeSpecValue.FillParent) styles['flex'] = 1;
    if (type === 'fixed' && value) styles['height'] = value;
  }
}

export function setBoxDirection(
  styles: ReactParsedProperties,
  layout: Layout = Layout.Row,
  align: Align = { vertical: AlignValue.Top, horizontal: AlignValue.Left },
) {
  if (layout === Layout.Row) {
    styles['flexDirection'] = 'row';
  }

  if (layout === Layout.Column) {
    styles['flexDirection'] = 'column';
  }

  if (align.horizontal) {
    const styleKey = layout === Layout.Row ? 'justifyContent' : 'alignItems';
    switch (align.horizontal) {
      case AlignValue.Center:
        styles[styleKey] = 'center';
        break;
      case AlignValue.Left:
        // styles[styleKey] = 'flex-start';
        break;
      case AlignValue.Right:
        styles[styleKey] = 'flex-end';
        break;
    }
  }

  if (align?.vertical) {
    const styleKey = layout === Layout.Row ? 'alignItems' : 'justifyContent';
    switch (align.vertical) {
      case AlignValue.Center:
        styles[styleKey] = 'center';
        break;
      case AlignValue.Top:
        // styles[styleKey] = 'flex-start';
        break;
      case AlignValue.Bottom:
        styles[styleKey] = 'flex-end';
        break;
    }
  }
}

export function setImageStyle(styles: ReactParsedProperties, imageStyle?: ImageStyle) {
  const { contentMode = MediaContentMode.AspectFit } = imageStyle || {};

  if (contentMode) {
    switch (contentMode) {
      case MediaContentMode.AspectFill:
        styles['objectFit'] = 'cover';
        break;
      case MediaContentMode.AspectFit:
        styles['objectFit'] = 'contain';
        break;
      case MediaContentMode.ScalesToFill:
        styles['objectFit'] = 'fill';
        break;
    }
  }
}

// uses image meta-date to render images that doesnt break the UI
// https://sendbird.atlassian.net/wiki/spaces/UK/pages/2008220608/Message+template+-+Image+policy
export function setImageAspectRatio(styles: ReactParsedProperties, props: Image | ImageButton) {
  const imageMetaData = props?.metaData;
  if (!imageMetaData?.pixelHeight || !imageMetaData?.pixelWidth) {
    return;
  }
  if (props?.width?.type === 'fixed' || props?.height?.type === 'fixed') {
    return;
  }
  styles['aspect-ratio'] = `${props?.metaData?.pixelWidth} / ${props?.metaData?.pixelHeight}`;
}

export function setTextStyle(styles: ReactParsedProperties, textStyle?: TextStyle) {
  // TODO: Change default as design
  const {
    size,
    color,
    weight = 'normal',
  } = textStyle || {};

  styles['fontSize'] = size as number;
  styles['color'] = color as string;
  styles['fontWeight'] = weight;
}
