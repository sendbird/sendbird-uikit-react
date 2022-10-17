import React, { useEffect, useState } from 'react';
import type { Logger } from './SendbirdState';

const DEFAULT_MOBILE = '768px';
const MOBILE_CLASSNAME = 'sendbird--mobile-mode';

const MediaQueryContext = React.createContext({
  mediaQueryBreakPoint: DEFAULT_MOBILE,
  isMobile: false,
});

export interface MediaQueryProviderProps {
  children: React.ReactElement;
  mediaQueryBreakPoint?: string;
  logger?: Logger;
}

const addClassNameToBody = () => {
  try {
    const body = document.querySelector('body');
    body.classList.add(MOBILE_CLASSNAME);
  } catch {
    // noop
  }
};

const removeClassNameFromBody = () => {
  try {
    const body = document.querySelector('body');
    body.classList.remove(MOBILE_CLASSNAME);
  } catch {
    // noop
  }
};

const MediaQueryProvider = (props: MediaQueryProviderProps): React.ReactElement => {
  const {
    children,
    logger,
  } = props;
  const mediaQueryBreakPoint = props?.mediaQueryBreakPoint || DEFAULT_MOBILE;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      const mq = window.matchMedia(`(max-width: ${mediaQueryBreakPoint})`);
      logger?.info?.(`MediaQueryProvider: Screensize updated to ${mediaQueryBreakPoint}`);
      if (mq.matches) {
        setIsMobile(true);
        addClassNameToBody();
        logger?.info?.(`MediaQueryProvider: isMobile: true`);
      } else {
        setIsMobile(false);
        removeClassNameFromBody();
        logger?.info?.(`MediaQueryProvider: isMobile: false`);
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    logger?.info?.(`MediaQueryProvider: addEventListener`, updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      logger?.info?.(`MediaQueryProvider: removeEventListener`, updateSize);
    }
  }, [mediaQueryBreakPoint]);
  return (
    <MediaQueryContext.Provider value={{ mediaQueryBreakPoint, isMobile }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export type useMediaQueryContextType = () => ({
  mediaQueryBreakPoint: string;
  isMobile: boolean;
});

const useMediaQueryContext: useMediaQueryContextType = () => React.useContext(MediaQueryContext);

export { MediaQueryProvider, useMediaQueryContext };
