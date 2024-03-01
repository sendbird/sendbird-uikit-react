import React, { ReactElement } from 'react';
interface MenuItemsProps {
    className?: string;
    style?: Record<string, string>;
    openLeft?: boolean;
    children: React.ReactElement | Array<React.ReactElement> | React.ReactNode;
    parentRef: React.RefObject<HTMLElement>;
    parentContainRef?: React.RefObject<HTMLElement>;
    closeDropdown: () => void;
}
type MenuStyleType = {
    top?: number;
    left?: number;
};
interface MenuItemsState {
    menuStyle: MenuStyleType;
    handleClickOutside: (e: MouseEvent) => void;
}
export default class MenuItems extends React.Component<MenuItemsProps, MenuItemsState> {
    constructor(props: MenuItemsProps);
    menuRef: React.RefObject<HTMLUListElement>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    setupEvents: () => void;
    cleanUpEvents: () => void;
    getMenuPosition: () => MenuStyleType;
    render(): ReactElement;
}
export {};
