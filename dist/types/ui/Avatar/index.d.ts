import React, { ReactElement } from 'react';
import './index.scss';
interface AvatarInnerProps {
    height: string | number;
    width: string | number;
    src?: string | Array<string>;
    alt?: string;
    customDefaultComponent?({ width, height }: {
        width: number | string;
        height: number | string;
    }): ReactElement;
}
export declare const AvatarInner: ({ src, alt, height, width, customDefaultComponent, }: AvatarInnerProps) => ReactElement;
interface AvatarProps {
    className?: string | Array<string>;
    height?: string | number;
    width?: string | number;
    zIndex?: string | number;
    left?: string;
    src?: string | Array<string>;
    alt?: string;
    onClick?(): void;
    customDefaultComponent?({ width, height }: {
        width: number | string;
        height: number | string;
    }): ReactElement;
}
declare const _default: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
