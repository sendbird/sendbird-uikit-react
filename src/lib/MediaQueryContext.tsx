import React, { useEffect, useState } from 'react';
import type { Logger } from './SendbirdState';

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
  // const breakpoint = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      if (typeof breakpoint === 'boolean') {
        setIsMobile(breakpoint);
        if (breakpoint) {
          logger?.info?.('MediaQueryProvider: isMobile: true');
          addClassNameToBody();
        } else {
          logger?.info?.('MediaQueryProvider: isMobile: false');
          removeClassNameFromBody();
        }
      } else {
        const mq = window.matchMedia(`(max-width: ${breakpoint})`);
        logger?.info?.(`MediaQueryProvider: Screensize updated to ${breakpoint}`);
        if (mq.matches) {
          setIsMobile(true);
          addClassNameToBody();
          logger?.info?.('MediaQueryProvider: isMobile: true');
        } else {
          setIsMobile(false);
          removeClassNameFromBody();
          logger?.info?.('MediaQueryProvider: isMobile: false');
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
