import React, { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { classnames } from '../../utils/utils';
import { MENU_OBSERVING_CLASS_NAME, MENU_ROOT_ID } from '.';
import { APP_LAYOUT_ROOT } from '../../modules/App/const';

interface MenuItemsProps {
  id?: string;
  className?: string;
  testID?: string;
  style?: Record<string, string>;
  openLeft?: boolean;
  children: React.ReactElement | Array<React.ReactElement> | React.ReactNode;
  parentRef?: React.RefObject<HTMLElement>;
  parentContainRef?: React.RefObject<HTMLElement>;
  closeDropdown: () => void;
}

type MenuStyleType = { top: number, left: number };
interface MenuItemsState {
  menuStyle: MenuStyleType;
  handleClickOutside: (e: MouseEvent) => void;
}

const HEIGHT_PADDING = 60;

export default class MenuItems extends React.Component<MenuItemsProps, MenuItemsState> {
  constructor(props: MenuItemsProps) {
    super(props);
    this.state = {
      menuStyle: { top: 0, left: 0 },
      handleClickOutside: () => { /* noop */ },
    };
  }

  menuRef: React.RefObject<HTMLUListElement> = React.createRef();

  componentDidMount(): void {
    this.setupEvents();
    this.getMenuPosition();
  }

  componentWillUnmount(): void {
    this.cleanUpEvents();
  }

  setupEvents = (): void => {
    const { closeDropdown } = this.props;
    const { menuRef } = this;
    const handleClickOutside = (event: any) => {
      if (menuRef?.current && !menuRef?.current?.contains?.(event.target)) {
        closeDropdown?.();
      }
    };
    this.setState({
      handleClickOutside,
    });

    document.addEventListener('mousedown', handleClickOutside);
  };

  cleanUpEvents = (): void => {
    const {
      handleClickOutside,
    } = this.state;
    document.removeEventListener('mousedown', handleClickOutside);
  };

  getMenuPosition = (): MenuStyleType => {
    const { parentRef, openLeft } = this.props;
    const portalElement = document.getElementById(APP_LAYOUT_ROOT);
    const portalRect = portalElement?.getBoundingClientRect?.() || {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    } as DOMRect;
    const parentRect = parentRef?.current?.getBoundingClientRect?.();

    const x = (parentRect?.x || parentRect?.left || 0) - portalRect.left;
    const y = (parentRect?.y || parentRect?.top || 0) - portalRect.top;
    const menuStyle = {
      top: y,
      left: x,
    };
    if (!this.menuRef.current) return menuStyle;
    const rect = this.menuRef.current.getBoundingClientRect();
    if (y + rect.height + HEIGHT_PADDING > portalRect.height) {
      menuStyle.top -= rect.height;
    }
    if (x + rect.width > portalRect.width && !openLeft) {
      menuStyle.left -= rect.width;
    }
    if (menuStyle.top < 0) {
      menuStyle.top = rect.height < portalRect.height ? (portalRect.height - rect.height) / 2 : 0;
    }
    menuStyle.top += 32;
    if (openLeft) {
      const padding = Number.isNaN(rect.width - 30)
        ? 108 // default
        : rect.width - 30;
      menuStyle.left -= padding;
    }
    if (menuStyle.left < 0) {
      menuStyle.left = rect.width < portalRect.width ? (portalRect.width - rect.width) / 2 : 0;
    }

    this.setState({ menuStyle });
    return menuStyle;
  };

  render(): ReactElement {
    const portalElement = document.getElementById(MENU_ROOT_ID);
    if (!portalElement)
      return <></>;

    const { menuStyle } = this.state;
    const { children, style, className = '', testID, id } = this.props;
    return (
      createPortal(
        (
          <div className={classnames(MENU_OBSERVING_CLASS_NAME, className)} data-testid={testID} id={id}>
            <div className="sendbird-dropdown__menu-backdrop" />
            <ul
              className={`${className} sendbird-dropdown__menu`}
              ref={this.menuRef}
              style={{
                display: 'inline-block',
                position: 'fixed',
                left: `${Math.round(menuStyle.left)}px`,
                top: `${Math.round(menuStyle.top)}px`,
                ...style,
              }}
              data-testid="sendbird-dropdown-menu"
            >
              {children}
            </ul>
          </div>
        ),
        portalElement,
      )
    );
  }
}
