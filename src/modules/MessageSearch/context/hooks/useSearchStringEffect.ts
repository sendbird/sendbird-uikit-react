import { useState, useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  searchString: string;
}

interface StaticParams {
  messageSearchDispatcher: (param: { type: string, payload: any }) => void;
}

const DEBOUNCING_TIME = 500;

function useSearchStringEffect(
  { searchString }: DynamicParams,
  { messageSearchDispatcher }: StaticParams,
): string {
  const [requestString, setRequestString] = useState<string>('');
  const [debouncingTimer, setDebouncingTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    clearTimeout(debouncingTimer ?? undefined);
    if (searchString) {
      setDebouncingTimer(
        setTimeout(() => {
          setRequestString(searchString);
        }, DEBOUNCING_TIME),
      );
    } else {
      setRequestString('');
      messageSearchDispatcher({
        type: messageActionTypes.RESET_SEARCH_STRING,
        payload: '',
      });
    }
  }, [searchString]);
  return requestString;
}

export default useSearchStringEffect;
