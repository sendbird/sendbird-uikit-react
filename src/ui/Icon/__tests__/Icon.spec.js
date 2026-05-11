import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Icon, { IconColors, IconTypes } from "../index";
import { changeColorToClassName, changeTypeToIconClassName } from '../utils';

describe('ui/Icon', () => {
  it('should do a snapshot test of the default Icon DOM', function () {
    const { asFragment } = render(
      <Icon type={IconTypes.ADD} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should map every icon color value to a class name', () => {
    Object.values(IconColors).forEach((color) => {
      expect(changeColorToClassName(color)).toEqual(expect.any(String));
    });
    expect(changeColorToClassName('UNKNOWN')).toBe('');
  });

  it('should map every icon type value to a class name', () => {
    Object.values(IconTypes).forEach((type) => {
      expect(changeTypeToIconClassName(type)).toEqual(expect.any(String));
    });
    expect(changeTypeToIconClassName('UNKNOWN')).toBe('sendbird-icon-unknown');
  });

  it('should render every icon type and support custom children and handlers', () => {
    Object.values(IconTypes).forEach((type) => {
      const { getByTestId, unmount } = render(
        <Icon type={type} fillColor={IconColors.PRIMARY} width="20px" height={18} testID={`icon-${type}`} />
      );
      const icon = getByTestId(`icon-${type}`);
      expect(icon).toHaveClass('sendbird-icon');
      expect(icon).toHaveStyle({ width: '20px', height: '18px' });
      unmount();
    });

    const onClick = jest.fn();
    const { getByTestId } = render(
      <Icon
        type={IconTypes.ADD}
        className={['custom-one', 'custom-two']}
        onClick={onClick}
        testID="custom-icon"
      >
        custom
      </Icon>
    );

    fireEvent.click(getByTestId('custom-icon'));
    fireEvent.keyDown(getByTestId('custom-icon'), { key: 'Enter' });

    expect(getByTestId('custom-icon')).toHaveTextContent('custom');
    expect(getByTestId('custom-icon')).toHaveClass('custom-one');
    expect(getByTestId('custom-icon')).toHaveClass('custom-two');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
