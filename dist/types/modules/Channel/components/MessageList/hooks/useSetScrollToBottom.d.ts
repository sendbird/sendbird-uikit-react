import React from 'react';
export declare function useSetScrollToBottom({ loading }: {
    loading: boolean;
}): {
    scrollBottom: number;
    scrollToBottomHandler: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
};
