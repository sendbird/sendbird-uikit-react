import useSendbirdStateContext from "../../hooks/useSendbirdStateContext";

export function filterNumber(input: string | number): Array<number> {
  if (typeof input !== 'string' && typeof input !== 'number') {
    try {
      const { config } = useSendbirdStateContext();
      const { logger } = config;
      logger.warning('@sendbird/uikit-react/ui/Toggle: TypeError - expected string or number.', input);
    } catch (_) { }
    return [];
  }
  if (typeof input === 'number') {
    return [input];
  }
  const regex = /(-?\d+)(\.\d+)?/g;
  const numbers = input.match(regex) || [];
  return numbers.map(parseFloat);
}
