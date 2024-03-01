import React, { ReactElement, MouseEvent, ReactNode } from 'react';
import './index.scss';
import _MenuItems from './MenuItems';
export declare const MenuItems: typeof _MenuItems;
export declare const EmojiListItems: ({ children, parentRef, parentContainRef, spaceFromTrigger, closeDropdown, }: import("./EmojiListItems").EmojiListItemsProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export interface MenuItemProps {
    className?: string | Array<string>;
    children: ReactElement | ReactElement[] | ReactNode;
    onClick?: (e: MouseEvent<HTMLLIElement>) => void;
    disable?: boolean;
    dataSbId?: string;
}
export declare const MenuItem: ({ className, children, onClick, disable, dataSbId, }: MenuItemProps) => ReactElement;
export declare const MenuRoot: () => ReactElement;
export declare const EmojiReactionListRoot: () => ReactElement;
type MenuDisplayingFunc = () => void;
export interface ContextMenuProps {
    menuTrigger?: (func: MenuDisplayingFunc) => ReactElement;
    menuItems: (func: MenuDisplayingFunc) => ReactElement;
    isOpen?: boolean;
    onClick?: (...args: any[]) => void;
}
export default function ContextMenu({ menuTrigger, menuItems, isOpen, onClick, }: ContextMenuProps): ReactElement;
export {};
