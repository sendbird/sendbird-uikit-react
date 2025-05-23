import { useState, useEffect, useCallback } from 'react';
import useMessageSearch from '../hooks/useMessageSearch';

interface DynamicParams {
  searchString: string;
}

const DEBOUNCING_TIME = 500;

function useSearchStringEffect({ searchString }: DynamicParams): string {
  const [requestString, setRequestString] = useState<string>('');
  const [debouncingTimer, setDebouncingTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { actions: { resetSearchString } } = useMessageSearch();

  const handleSearchStringChange = useCallback(() => {
    if (searchString) {
      setRequestString(searchString);
    } else {
      setRequestString('');
      resetSearchString();
    }
  }, [searchString, resetSearchString]);

  useEffect(() => {
    if (debouncingTimer) {
      clearTimeout(debouncingTimer);
    }

    const timer = setTimeout(handleSearchStringChange, DEBOUNCING_TIME);
    setDebouncingTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchString, handleSearchStringChange]);

  return requestString;
}

export default useSearchStringEffect;
