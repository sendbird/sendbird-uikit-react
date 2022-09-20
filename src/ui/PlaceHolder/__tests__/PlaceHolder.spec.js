import React from 'react';
import { render } from '@testing-library/react';

import PlaceHolder from "../index";
import PlaceHolderTypes from '../type';

describe('ui/PlaceHolder', () => {
  it('should should contain className', function () {
    const text = "example-text";
    const { container } = render(<PlaceHolder className={text} type={PlaceHolderTypes.WRONG} />);
    expect(
      container.getElementsByClassName('sendbird-place-holder')[0].className
    ).toContain('sendbird-place-holder');
    expect(
      container.getElementsByClassName('sendbird-place-holder').length
    ).toBe(1);
  });

  it('should do a snapshot test of the PlaceHolder DOM', function () {
    const text = "example-text";
    const { asFragment } = render(<PlaceHolder className={text} type={PlaceHolderTypes.WRONG} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
