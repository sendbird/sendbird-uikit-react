/// <reference types="react" />
type KeyDownCallbackMap = Record<string, (event: React.KeyboardEvent<HTMLDivElement>) => void>;
export declare function useKeyDown(ref: React.RefObject<HTMLDivElement>, keyDownCallbackMap: KeyDownCallbackMap): React.KeyboardEventHandler<HTMLDivElement>;
export {};
