import { ReactElement } from 'react';
interface Props {
    children: Array<ReactElement> | ReactElement;
    className?: string;
}
export default function AccordionGroup({ children, className, }: Props): ReactElement;
export {};
