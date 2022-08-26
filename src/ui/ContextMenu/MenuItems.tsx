import React, { ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type MenuStyle = { left: number, top: number };
export interface MenuItemsProps {
  className?: string | Array<string>;
  children?: ReactElement;
  style?: { [key: string]: string };
  parentRef: RefObject<HTMLDivElement>;
  parentContainRef?: RefObject<HTMLDivElement>;
  openLeft?: boolean;
  closeDropdown: () => void;
}

const MenuItems = ({
  className,
  children,
  style = {},
  parentRef,
  parentContainRef,
  openLeft = false,
  closeDropdown,
}: MenuItemsProps): ReactElement => {
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState<MenuStyle>({ left: 0, top: 0 });

  /* showParent & hideParent */
  useEffect(() => {
    if (parentContainRef && parentContainRef?.current) {
      parentContainRef.current.classList.add('sendbird-reactions--pressed');
    }
    return () => {
      if (parentContainRef && parentContainRef?.current) {
        parentContainRef.current.classList.remove('sendbird-reactions--pressed');
      }
    };
  }, []);

  /* setupEvents & cleanupEvents */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current.contains?.(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* getMenuPosition */
  useEffect(() => {
    const parentRect = parentRef?.current?.getBoundingClientRect();
    const x = parentRect.x || parentRect.left;
    const y = parentRect.y || parentRect.top;
    const menuStyle = {
      top: y,
      left: x,
    };
    if (!menuRef?.current) {
      setMenuStyle(menuStyle);
    } else {
      const { innerWidth, innerHeight } = window;
      const rect = menuRef.current.getBoundingClientRect();
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
      setMenuStyle(menuStyle);
    }
  }, []);

  return createPortal(
    (
      <div className={Array.isArray(className) ? className.join(' ') : className}>
        <div className="sendbird-dropdown__menu-backdrop" />
        <ul
          className="sendbird-dropdown__menu"
          ref={menuRef}
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
      </div>
    ),
    document.getElementById('sendbird-dropdown-portal')
  );
};

export default MenuItems;
