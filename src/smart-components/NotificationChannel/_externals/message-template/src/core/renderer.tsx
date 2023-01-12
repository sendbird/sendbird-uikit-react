import React from 'react';

import type { BasicProps, ComponentType, ComponentsUnion, GetProperties } from '../types/components';

type FC<Props, ParsedStyle> = (props: BasicProps<Props, ParsedStyle>) => React.ReactElement | null;

type ComponentProperties<Type extends ComponentType> = GetProperties<Type, ComponentsUnion>;

interface RendererOptions<ParsedStyle> {
  views?: {
    [component in ComponentType]?: FC<ComponentProperties<component>, ParsedStyle>;
  };
}

export type Renderer<ParsedStyle> = {
  [component in ComponentType]: FC<ComponentProperties<component>, ParsedStyle>;
};

const FRAGMENT = ({ children }: React.PropsWithChildren) => <React.Fragment>{children}</React.Fragment>;

export function createRenderer<ParsedStyle = object | string>(
  opts?: RendererOptions<ParsedStyle>,
): Renderer<ParsedStyle> {
  return {
    box: opts?.views?.box || FRAGMENT,
    text: opts?.views?.text || FRAGMENT,
    image: opts?.views?.image || FRAGMENT,
    imageButton: opts?.views?.imageButton || FRAGMENT,
    textButton: opts?.views?.textButton || FRAGMENT,
  };
}
