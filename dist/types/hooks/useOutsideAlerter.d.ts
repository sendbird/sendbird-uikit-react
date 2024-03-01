import React from 'react';
type UseOutsideAlerterParams = {
    ref: React.MutableRefObject<HTMLElement>;
    callback: () => void;
};
export default function useOutsideAlerter({ ref, callback, }: UseOutsideAlerterParams): void;
export {};
