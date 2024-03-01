/**
 * Note: `leading` has higher priority rather than `trailing`
 * */
export declare function useThrottleCallback<T extends (...args: any[]) => void>(callback: T, delay: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): T;
/**
 * Note: `leading` has higher priority rather than `trailing`
 * */
export declare function throttle<T extends (...args: any[]) => void>(callback: T, delay: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): T;
