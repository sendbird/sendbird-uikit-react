import React from 'react';
type UseHoverParams = {
    ref: React.MutableRefObject<HTMLElement>;
    setHover: (value: boolean) => void;
};
declare const useMouseHover: ({ ref, setHover }: UseHoverParams) => void;
export default useMouseHover;
