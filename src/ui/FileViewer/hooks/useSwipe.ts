import { useState } from 'react';

interface SwipeProps {
  moveSliderLeft: () => void;
  moveSliderRight: () => void;
}

const SWIPE_THRESHOLD_IN_MILLIES = 150;

// Code reference: https://stackoverflow.com/questions/40463173/swipe-effect-in-react-js
export function useSwipe(props: SwipeProps) {
  const { moveSliderLeft, moveSliderRight } = props;
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  function handleTouchStart(e) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
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
