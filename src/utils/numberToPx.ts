export default (value: string | number | null): string | undefined => {
  if (value === null)
    return undefined;

  return typeof value === 'number' ? `${value}px` : value;
};
