import React from 'react';
export declare function isTouchEvent(e: Event): e is TouchEvent;
interface PressHandlers<T> {
    onLongPress: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
    onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}
interface Options {
    delay?: number;
    shouldPreventDefault?: boolean;
    shouldStopPropagation?: boolean;
}
interface UseLongPressType<T> {
    onTouchMove: (e: React.TouchEvent<T>) => void;
    onMouseDown: (e: React.MouseEvent<T>) => void;
    onTouchStart: (e: React.TouchEvent<T>) => void;
    onMouseUp: (e: React.MouseEvent<T>) => void;
    onMouseLeave: (e: React.MouseEvent<T>) => void;
    onTouchEnd: (e: React.TouchEvent<T>) => void;
}
export default function useLongPress<T>({ onLongPress, onClick, }: PressHandlers<T>, { delay, shouldPreventDefault, shouldStopPropagation, }?: Options): UseLongPressType<T>;
export {};
