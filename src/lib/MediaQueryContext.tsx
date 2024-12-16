import React, { useEffect, useState } from 'react';
import type { Logger } from './Sendbird/types';

const DEFAULT_MOBILE = false;
// const DEFAULT_MOBILE = '768px';
const MOBILE_CLASSNAME = 'sendbird--mobile-mode';

export type useMediaQueryContextType = () => ({
  breakpoint: string | boolean;
  isMobile: boolean;
});

const MediaQueryContext = React.createContext<ReturnType<useMediaQueryContextType>>({
  breakpoint: DEFAULT_MOBILE,
  isMobile: false,
});

export interface MediaQueryProviderProps {
  children: React.ReactElement;
  breakpoint?: string | boolean;
  logger?: Logger;
}

const addClassNameToBody = () => {
  try {
    const body = document.querySelector('body');
    body?.classList.add(MOBILE_CLASSNAME);
  } catch {
    // noop
  }
};

const removeClassNameFromBody = () => {
  try {
    const body = document.querySelector('body');
    body?.classList.remove(MOBILE_CLASSNAME);
  } catch {
    // noop
  }
};

const MediaQueryProvider = (props: MediaQueryProviderProps): React.ReactElement => {
  const {
    children,
    logger,
  } = props;
  const breakpoint = props?.breakpoint || false;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      if (typeof breakpoint === 'boolean') {
        setIsMobile(breakpoint);
        if (breakpoint) {
          addClassNameToBody();
        } else {
          removeClassNameFromBody();
        }
      } else {
        const mq = window.matchMedia(`(max-width: ${breakpoint})`);
        logger?.info?.(`MediaQueryProvider: Screensize updated to ${breakpoint}`);
        if (mq.matches) {
          setIsMobile(true);
          addClassNameToBody();
        } else {
          setIsMobile(false);
          removeClassNameFromBody();
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    logger?.info?.('MediaQueryProvider: addEventListener', { updateSize });
    return () => {
      window.removeEventListener('resize', updateSize);
      logger?.info?.('MediaQueryProvider: removeEventListener', { updateSize });
    };
  }, [breakpoint]);
  return (
    <MediaQueryContext.Provider value={{ breakpoint, isMobile }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

const useMediaQueryContext: useMediaQueryContextType = () => React.useContext(MediaQueryContext);

export { MediaQueryProvider, useMediaQueryContext };
