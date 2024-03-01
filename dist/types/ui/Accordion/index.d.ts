import { ReactElement } from 'react';
import './index.scss';
import AccordionGroup_ from './AccordionGroup';
interface Props {
    className?: string | Array<string>;
    id: string;
    renderTitle(): ReactElement;
    renderContent(): ReactElement;
    renderFooter?(): ReactElement;
}
export default function Accordion({ className, id, renderTitle, renderContent, renderFooter, }: Props): ReactElement;
export declare const AccordionGroup: typeof AccordionGroup_;
export {};
