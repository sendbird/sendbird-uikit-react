import { useEffect } from 'react';

const MOUSE_ENTER = 'mouseenter';
const MOUSE_LEAVE = 'mouseleave';

const useMouseHover = ({
  ref,
  setHover,
}) => {
  const handleMouseOver = () => {
    if (ref.current) {
      setHover(true);
    }
  };
  const handleMouseOut = () => {
    if (ref.current) {
      setHover(false);
    }
  };

  useEffect(() => {
    const { current } = ref;
    if (current) {
      current.addEventListener(MOUSE_ENTER, handleMouseOver);
      current.addEventListener(MOUSE_LEAVE, handleMouseOut);
    }
    return () => {
      if (current) {
        current.removeEventListener(MOUSE_ENTER, handleMouseOver);
        current.removeEventListener(MOUSE_LEAVE, handleMouseOut);
      }
    };
  });
};

export default useMouseHover;
