import { useEffect } from 'react';

/* eslint-disable default-param-last */
function useAppendDomNode(ids = [], rootSelector) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    ids.forEach((id) => {
      const elem = document.createElement('div');
      elem.setAttribute('id', id);
      root.appendChild(elem);
    });
    return () => {
      ids.forEach((id) => {
        const target = document.getElementById(id);
        if (target) {
          root.removeChild(target);
        }
      });
    };
  }, []);
}

export default useAppendDomNode;
