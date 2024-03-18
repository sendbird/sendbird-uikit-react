export default (value: string | number | null): string => {
  if (value === null)
    value = 0;
  
  return typeof value === 'number' ? `${value}px` : value;
};
