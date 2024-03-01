import { ReactElement, ReactNode } from 'react';
import './index.scss';
export interface SortByRowProps {
    className?: string | Array<string>;
    maxItemCount: number;
    itemWidth: number;
    itemHeight: number;
    children: ReactNode;
}
export default function SortByRow({ className, maxItemCount, itemWidth, itemHeight, children, }: SortByRowProps): ReactElement;
