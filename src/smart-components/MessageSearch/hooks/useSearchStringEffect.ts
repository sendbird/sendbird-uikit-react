import { useEffect } from 'react';

interface DynamicParams {
  searchString: string;
}
interface StaticParams {
  setRequestString(string: string): void;
}

const DEBOUNCING_TIME = 500;

function useSearchStringEffect(
  { searchString }: DynamicParams,
  { setRequestString }: StaticParams,
): void {
  let debouncingTimer = null;
  useEffect(() => {
    if (debouncingTimer) {
      clearTimeout(debouncingTimer);
      debouncingTimer = null;
    }
    setTimeout(() => {
      setRequestString(searchString);
    }, DEBOUNCING_TIME);
  }, [searchString]);
}

export default useSearchStringEffect;
