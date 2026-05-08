import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import MenuItems from '../MenuItems';
import { MENU_OBSERVING_CLASS_NAME, MENU_ROOT_ID } from '..';
import { APP_LAYOUT_ROOT } from '../../../modules/App/const';

const rect = (overrides: Partial<DOMRect> = {}) => ({
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  toJSON: () => ({}),
  ...overrides,
} as DOMRect);

const setupPortalRoots = () => {
  const appRoot = document.createElement('div');
  appRoot.id = APP_LAYOUT_ROOT;
  document.body.appendChild(appRoot);

  const menuRoot = document.createElement('div');
  menuRoot.id = MENU_ROOT_ID;
  document.body.appendChild(menuRoot);

  return { appRoot, menuRoot };
};

describe('ContextMenu MenuItems', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    delete (window as any).requestAnimationFrame;
    delete (window as any).cancelAnimationFrame;
    delete (global as any).requestAnimationFrame;
    delete (global as any).cancelAnimationFrame;
  });

  it('renders nothing when the menu portal root is missing', () => {
    const { container } = render(
      <MenuItems closeDropdown={jest.fn()}>
        <li>item</li>
      </MenuItems>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('positions menu items inside the app layout and closes on outside clicks', () => {
    setupPortalRoots();
    const parent = document.createElement('button');
    document.body.appendChild(parent);
    const closeDropdown = jest.fn();
    jest.spyOn(parent, 'getBoundingClientRect').mockReturnValue(rect({
      x: 180,
      y: 140,
      left: 180,
      top: 140,
    }));
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect() {
      if (this.id === APP_LAYOUT_ROOT) {
        return rect({ top: 10, left: 20, width: 200, height: 160 });
      }
      if (this.classList.contains('sendbird-dropdown__menu')) {
        return rect({ width: 80, height: 120 });
      }
      return rect();
    });

    render(
      <MenuItems
        className="menu-class"
        testID="menu-wrapper"
        id="menu-id"
        parentRef={{ current: parent }}
        closeDropdown={closeDropdown}
      >
        <li>item</li>
      </MenuItems>
    );

    const wrapper = screen.getByTestId('menu-wrapper');
    const menu = screen.getByTestId('sendbird-dropdown-menu');

    expect(wrapper).toHaveClass(MENU_OBSERVING_CLASS_NAME);
    expect(wrapper).toHaveAttribute('id', 'menu-id');
    expect(menu).toHaveStyle({ left: '80px', top: '42px' });

    fireEvent.mouseDown(menu);
    expect(closeDropdown).not.toHaveBeenCalled();

    fireEvent.mouseDown(document.body);
    expect(closeDropdown).toHaveBeenCalledTimes(1);
  });

  it('uses openLeft positioning and recomputes on window resize', () => {
    setupPortalRoots();
    const parent = document.createElement('button');
    document.body.appendChild(parent);
    jest.spyOn(parent, 'getBoundingClientRect').mockReturnValue(rect({
      x: 20,
      y: 20,
      left: 20,
      top: 20,
    }));
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getRect() {
      if (this.id === APP_LAYOUT_ROOT) {
        return rect({ top: 0, left: 0, width: 240, height: 240 });
      }
      if (this.classList.contains('sendbird-dropdown__menu')) {
        return rect({ width: 100, height: 40 });
      }
      return rect();
    });
    const raf = jest.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const cancel = jest.fn();
    Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: raf });
    Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: cancel });
    Object.defineProperty(global, 'requestAnimationFrame', { configurable: true, value: raf });
    Object.defineProperty(global, 'cancelAnimationFrame', { configurable: true, value: cancel });

    const { unmount } = render(
      <MenuItems
        openLeft
        parentRef={{ current: parent }}
        closeDropdown={jest.fn()}
      >
        <li>item</li>
      </MenuItems>
    );

    expect(screen.getByTestId('sendbird-dropdown-menu')).toHaveStyle({ left: '70px', top: '52px' });

    act(() => {
      window.dispatchEvent(new window.Event('resize'));
    });
    expect(raf).toHaveBeenCalled();

    unmount();
    expect(cancel).toHaveBeenCalledWith(1);
  });
});
