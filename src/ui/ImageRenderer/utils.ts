import numberToPx from "../../utils/numberToPx";

export function getDynamicMinLengthInPx(
  sideLength: string | number,
  maxSideLength: string | null,
  defaultMinLength: string
): string {
  return `min(${maxSideLength ?? defaultMinLength}, ${numberToPx(sideLength) ?? defaultMinLength})`;
}