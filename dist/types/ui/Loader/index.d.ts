import { ReactElement } from 'react';
import './index.scss';
export interface LoaderProps {
    className?: string | Array<string>;
    width?: string | number;
    height?: string | number;
    children?: ReactElement;
}
export default function Loader({ className, width, height, children, }: LoaderProps): ReactElement;
