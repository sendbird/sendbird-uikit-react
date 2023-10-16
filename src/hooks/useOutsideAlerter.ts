import React, { useEffect } from 'react';

type UseOutsideAlerterParams = {
  ref: React.MutableRefObject<HTMLElement>;
  callback: () => void;
};

export default function useOutsideAlerter({
  ref,
  callback,
}: UseOutsideAlerterParams) {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target instanceof HTMLElement
      && ref.current?.contains(event.target)
    ) {
      callback();
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
}
