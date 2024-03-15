import { SendbirdTheme } from '../../../types';

export function convertArgbToRgba(string: string) {
  if (!string.startsWith('#')) {
    return string;
  }
  if (string.length === 9) {
    return `#${string.slice(3)}${string[1]}${string[2]}`;
  }
  if (string.length === 5) {
    return `#${string.slice(2)}${string[1]}`;
  }
  return string;
}

const splitColorVariables = (colorVariables: Record<string, any>): [Record<string, unknown>, Record<string, unknown>] => { const light = {};
  const dark = {};

  for (const key in colorVariables) {
    if (Object.prototype.hasOwnProperty.call(colorVariables, key)) {
      const value = colorVariables[key];
      if (typeof value === 'object' && value !== null) {
        const [nestedLight, nestedDark] = splitColorVariables(value as Record<string, any>);
        light[key] = nestedLight;
        dark[key] = nestedDark;
      } else if (typeof value === 'string') {
        const [lightColor, darkColor] = value.split(',');
        light[key] = lightColor;
        dark[key] = darkColor || lightColor; // when dark color is not provided, use light color
      } else {
        light[key] = value;
        dark[key] = value;
      }
    }
  }
  return [light, dark];
};

export default function selectColorVariablesByTheme({ colorVariables, theme }: {
  colorVariables: Record<string, unknown>;
  theme: SendbirdTheme;
}): Record<string, unknown> {
  const [light, dark] = splitColorVariables(colorVariables);
  return theme === 'light' ? light : dark;
}
