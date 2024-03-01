import React from 'react';
export interface UseHandleOnScrollCallbackProps {
    hasMore: boolean;
    hasNext?: boolean;
    onScroll(callback: () => void): void;
    scrollRef: React.RefObject<HTMLDivElement>;
    setShowScrollDownButton?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare function calcScrollBottom(scrollHeight: number, scrollTop: number): number;
export declare function useHandleOnScrollCallback({ hasMore, hasNext, onScroll, scrollRef, setShowScrollDownButton, }: UseHandleOnScrollCallbackProps): () => void;
