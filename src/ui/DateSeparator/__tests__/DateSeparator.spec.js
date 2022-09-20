import React from 'react';
import { render } from '@testing-library/react';

import DateSeparator from "../index";

describe('ui/DateSeparator', () => {
  it('should contain className', function () {
    const className = "example-classname";
    const { container } = render(<DateSeparator className={className} />);

    expect(container.getElementsByClassName('sendbird-separator')[0].className).toContain(className);
    expect(container.getElementsByClassName('sendbird-separator')[0].className).toContain('sendbird-separator');
  });

  it('should do a snapshot test of the DateSeparator DOM', function () {
    const className = "example-classname";
    const { asFragment } = render(<DateSeparator className={className} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
