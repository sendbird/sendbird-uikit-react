import React from 'react';
import type { Logger } from './SendbirdState';
export type useMediaQueryContextType = () => ({
    breakpoint: string | boolean;
    isMobile: boolean;
});
export interface MediaQueryProviderProps {
    children: React.ReactElement;
    breakpoint?: string | boolean;
    logger?: Logger;
}
declare const MediaQueryProvider: (props: MediaQueryProviderProps) => React.ReactElement;
declare const useMediaQueryContext: useMediaQueryContextType;
export { MediaQueryProvider, useMediaQueryContext };
