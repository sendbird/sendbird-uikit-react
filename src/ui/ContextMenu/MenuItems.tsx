import React, { ReactElement } from 'react';
import { createPortal } from 'react-dom';

interface MenuItemsProps {
  style?: Record<string, string>;
  openLeft?: boolean;
  children: React.ReactElement;
  parentRef: React.RefObject<HTMLDivElement>;
  parentContainRef: React.RefObject<HTMLDivElement>;
  closeDropdown: () => void;
}

type MenuStyleType = { top?: number, left?: number };
interface MenuItemsState {
  menuStyle: MenuStyleType;
  handleClickOutside: (e: MouseEvent) => void;
}

export default class MenuItems extends React.Component<MenuItemsProps, MenuItemsState> {
  constructor(props: MenuItemsProps) {
    super(props);
    this.state = {
      menuStyle: {},
      handleClickOutside: () => {/* noop */ },
    };
  }
  menuRef: React.RefObject<HTMLUListElement> = React.createRef();

  componentDidMount(): void {
    this.setupEvents();
    this.getMenuPosition();
    // this.showParent();
  }

  componentWillUnmount(): void {
    this.cleanUpEvents();
    // this.hideParent();
  }

  // showParent = (): void => {
  //   const { parentContainRef } = this.props;
  //   const { current } = parentContainRef;
  //   if (parentContainRef && current) {
  //     current.classList.add('sendbird-menu-item-trigger--pressed');
  //   }
  // }

  // hideParent = (): void => {
  //   const { parentContainRef } = this.props;
  //   const { current } = parentContainRef;
  //   if (parentContainRef && current) {
  //     current.classList.remove('sendbird-menu-item-trigger--pressed');
  //   }
  // }

  setupEvents = (): void => {
    const { closeDropdown } = this.props;
    const { menuRef } = this;
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains?.(event.target)) {
        closeDropdown?.();
      }
    };
    this.setState({
      handleClickOutside,
    });

    document.addEventListener('mousedown', handleClickOutside);
  }

  cleanUpEvents = (): void => {
    const {
      handleClickOutside,
    } = this.state;
    document.removeEventListener('mousedown', handleClickOutside);
  }

  getMenuPosition = (): MenuStyleType => {
    const { parentRef, openLeft } = this.props;
    const parentRect = parentRef?.current?.getBoundingClientRect?.();
    const x = parentRect?.x || parentRect?.left || 0;
    const y = parentRect?.y || parentRect?.top || 0;
    const menuStyle = {
      top: y,
      left: x,
    };
    if (!this.menuRef.current) return menuStyle;
    const { innerWidth, innerHeight } = window;
    const rect = this.menuRef.current.getBoundingClientRect();
    if (y + rect.height > innerHeight) {
      menuStyle.top -= rect.height;
    }
    if (x + rect.width > innerWidth && !openLeft) {
      menuStyle.left -= rect.width;
    }
    if (menuStyle.top < 0) {
      menuStyle.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
    }
    if (menuStyle.left < 0) {
      menuStyle.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
    }
    menuStyle.top += 32;
    if (openLeft) {
      const padding = Number.isNaN(rect.width - 30)
        ? 108 // default
        : rect.width - 30;
      menuStyle.left -= padding;
    }
    this.setState({ menuStyle })
    return menuStyle;
  }

  render(): ReactElement {
    const { menuStyle } = this.state;
    const { children, style } = this.props;
    return (
      createPortal(
        (
          <>
            <div className="sendbird-dropdown__menu-backdrop" />
            <ul
              className="sendbird-dropdown__menu"
              ref={this.menuRef}
              style={{
                display: 'inline-block',
                position: 'fixed',
                left: `${Math.round(menuStyle.left)}px`,
                top: `${Math.round(menuStyle.top)}px`,
                ...style,
              }}
            >
              {children}
            </ul>
          </>
        ),
        document.getElementById('sendbird-dropdown-portal'),
      )
    );
  }
}
