import { useState } from 'react';
import {SWIPE_THRESHOLD_IN_MILLIES} from "../../../utils/consts";

interface SwipeProps {
  moveSliderLeft: () => void;
  moveSliderRight: () => void;
}

/**
 * Code reference: https://stackoverflow.com/questions/40463173/swipe-effect-in-react-js
 * Warning: It is not supported in Safari.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event#browser_compatibility
 * @param props
 */
export function useSwipe(props: SwipeProps) {
  const { moveSliderLeft, moveSliderRight } = props;
  const [touchStart, setTouchStart] = useState(0);

  function handleTouchStart(e) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchEnd(e) {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > SWIPE_THRESHOLD_IN_MILLIES) {
      moveSliderRight();
    }
    if (touchStart - touchEnd < -SWIPE_THRESHOLD_IN_MILLIES) {
      moveSliderLeft();
    }
  }

  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);

  return () => {
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
  };
}
