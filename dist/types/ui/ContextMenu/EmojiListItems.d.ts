import { ReactElement, ReactNode, RefObject } from 'react';
import { Nullable } from '../../types';
type SpaceFromTrigger = {
    x: number;
    y: number;
};
export interface EmojiListItemsProps {
    closeDropdown: () => void;
    children: ReactNode;
    parentRef: RefObject<HTMLDivElement>;
    parentContainRef: RefObject<HTMLDivElement>;
    spaceFromTrigger?: SpaceFromTrigger;
}
export declare const EmojiListItems: ({ children, parentRef, parentContainRef, spaceFromTrigger, closeDropdown, }: EmojiListItemsProps) => Nullable<ReactElement>;
export default EmojiListItems;
