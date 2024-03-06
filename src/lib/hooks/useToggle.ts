
import { useEffect, useState } from 'react';

export interface ToggleOptions {
  initialValue?: boolean;
  throttlingTime?: number;
}

const DEFAULT_TOGGLE_INITIAL_VALUE = false;
const DEFAULT_TOGGLE_THROTTLING_TIME = 500;

/**
 * @description Use toggle with throttling.
 *  [usage]
 *  const toggle = useToggle(false, (isOn: boolean) => {
 *    // do something with the flag.
 *  });
 *  ...
 *  toggle();
 *  toggle();
 *  toggle(); // this 3x calls fall into one toggle handler call (throttled).
 * 
 *  ...
 *  toggle();
 *  toggle(); // this 2x calls do not call toggle handler because the value does not change eventually.
 */
function useToggle(
  toggleHandler: (isOn: boolean) => any,
  options: ToggleOptions = {},
) {
  const initialValue = options.initialValue ?? DEFAULT_TOGGLE_INITIAL_VALUE;
  const [isOn, setIsOn] = useState(initialValue);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isFinallyOn, setIsFinallyOn] = useState(initialValue);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => {
      if (isFinallyOn !== isOn) {
        toggleHandler(isOn);
        setIsFinallyOn(isFinallyOn);
      }
    }, options.throttlingTime ?? DEFAULT_TOGGLE_THROTTLING_TIME));
  }, [isOn]);

  return () => {
    setIsOn((prev: boolean) => !prev);
  };
}

export default useToggle;