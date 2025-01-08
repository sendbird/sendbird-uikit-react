import { useEffect, useState } from 'react';

const useDidMountEffect = (func: () => void, deps: Array<unknown>): void => {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    console.log('effect');
    if (didMount) {
      func();
    } else {
      setDidMount(true);
    }
  }, deps);
};

export default useDidMountEffect;
