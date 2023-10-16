import React, { useEffect } from 'react';

const MOUSE_ENTER = 'mouseenter';
const MOUSE_LEAVE = 'mouseleave';

type UseHoverParams = {
  ref: React.MutableRefObject<HTMLElement>;
  setHover: (value: boolean) => void;
};

const useMouseHover = ({ ref, setHover }: UseHoverParams) => {
  useEffect(() => {
    const handleMouseOver = () => {
      if (ref.current) setHover(true);
    };
    const handleMouseOut = () => {
      if (ref.current) setHover(false);
    };

    if (ref.current) {
      ref.current.addEventListener(MOUSE_ENTER, handleMouseOver);
      ref.current.addEventListener(MOUSE_LEAVE, handleMouseOut);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener(MOUSE_ENTER, handleMouseOver);
        ref.current.removeEventListener(MOUSE_LEAVE, handleMouseOut);
      }
    };
  }, [ref, setHover]);
};

export default useMouseHover;
