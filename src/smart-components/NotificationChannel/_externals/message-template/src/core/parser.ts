// -------- Set property mapper
import { Box, ComponentType, ComponentsUnion, Image, ImageButton, Text, TextButton } from '../types/components';

interface ParserOptions<ParsedProperties> {
  defaultMapper?(...args: any[]): any;
  mapBoxProps?(properties: Box): ParsedProperties;
  mapTextProps?(properties: Text): ParsedProperties;
  mapImageProps?(properties: Image): ParsedProperties;
  mapTextButtonProps?(properties: TextButton): ParsedProperties;
  mapImageButtonProps?(properties: ImageButton): ParsedProperties;
}

export interface Parser<ParsedProperties> {
  parse(item: ComponentsUnion['properties']): {
    properties: ParsedProperties | undefined;
  };
}

const MAPPER: ParserOptions<any>['defaultMapper'] = () => undefined;

export const createParser = <ParsedProperties = object | string>(
  opts?: ParserOptions<ParsedProperties>,
): Parser<ParsedProperties> => {
  const mapper = {
    box: opts?.mapBoxProps || opts?.defaultMapper || MAPPER,
    text: opts?.mapTextProps || opts?.defaultMapper || MAPPER,
    image: opts?.mapImageProps || opts?.defaultMapper || MAPPER,
    textButton: opts?.mapTextButtonProps || opts?.defaultMapper || MAPPER,
    imageButton: opts?.mapImageButtonProps || opts?.defaultMapper || MAPPER,
  };

  return {
    parse(item) {
      switch (item.type) {
        case ComponentType.Box: {
          return { properties: mapper.box(item) };
        }
        case ComponentType.Text: {
          return { properties: mapper.text(item) };
        }
        case ComponentType.Image: {
          return { properties: mapper.image(item) };
        }
        case ComponentType.TextButton: {
          return { properties: mapper.textButton(item) };
        }
        case ComponentType.ImageButton: {
          return { properties: mapper.imageButton(item) };
        }
        default:
          return { properties: undefined };
      }
    },
  };
};

// -------- Default values
interface ByAppearance<T> {
  light: T;
  dark: T;
}

interface DefaultStyle {
  _: undefined;
}

export const DEFAULT_PARSER_VALUES: ByAppearance<DefaultStyle> = {
  light: { _: undefined },
  dark: { _: undefined },
};
