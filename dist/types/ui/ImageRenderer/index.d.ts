import { ReactElement } from 'react';
import './index.scss';
export declare function getBorderRadiusForImageRenderer(circle?: boolean, borderRadius?: string | number): string;
export declare function getBorderRadiusForMultipleImageRenderer(borderRadius: string | number, index: number, totalCount: number): string;
export interface ImageRendererProps {
    className?: string | Array<string>;
    url: string;
    alt?: string;
    width?: string | number;
    maxSideLength?: string;
    height?: string | number;
    circle?: boolean;
    fixedSize?: boolean;
    placeHolder?: ((props: {
        style: Record<string, string | number>;
    }) => ReactElement) | ReactElement;
    defaultComponent?: (() => ReactElement) | ReactElement;
    borderRadius?: string | number;
    onLoad?: () => void;
    onError?: () => void;
    shadeOnHover?: boolean;
    isUploaded?: boolean;
}
declare const ImageRenderer: ({ className, url, alt, width, maxSideLength, height, circle, fixedSize, placeHolder, defaultComponent, borderRadius, onLoad, onError, shadeOnHover, isUploaded, }: ImageRendererProps) => ReactElement;
export default ImageRenderer;
