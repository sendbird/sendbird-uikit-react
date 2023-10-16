import { useEffect } from 'react';

function useAppendDomNode(
  ids: string[] = [],
  rootSelector: string = 'unknown'
) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (root) {
      ids.forEach((id) => {
        const elem = document.createElement('div');
        elem.setAttribute('id', id);
        root.appendChild(elem);
      });
    }
    return () => {
      if (root) {
        ids.forEach((id) => {
          const target = document.getElementById(id);
          if (target) root.removeChild(target);
        });
      }
    };
  }, []);
}

export default useAppendDomNode;
