import { useEffect, useState } from 'react';

const useDidMountEffect = (func: Function, deps: Array<unknown>): void => {
    const [didMount, setDidmount] = useState(false);
    useEffect(() => {
        if (didMount) {
          func();
        } else {
          setDidmount(true);
        }
    }, deps);
};

export default useDidMountEffect;
