interface DynamicSideLengthProps {
    width: string | number;
    height: string | number;
    maxSideLength: string | null;
    defaultMinLength: string;
}
export declare function useDynamicSideLength({ width, height, maxSideLength, defaultMinLength, }: DynamicSideLengthProps): string[];
export {};
