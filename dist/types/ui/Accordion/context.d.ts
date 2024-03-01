import React from 'react';
interface ContextValue {
    setOpened(accordion: string): void;
    opened: string;
}
export declare const Consumer: React.Consumer<ContextValue>;
export declare const Provider: React.Provider<ContextValue>;
export {};
