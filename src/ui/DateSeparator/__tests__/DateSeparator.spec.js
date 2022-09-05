import React from 'react';
import { render, screen } from '@testing-library/react';

import DateSeparator from "../index";

describe('ui/DateSeparator', () => {
  it('should contain className', function () {
    const className = "example-classname";
    render(<DateSeparator className={className} />);

    expect(screen.getByTestId('sendbird-separator').className).toContain(className);
    expect(screen.getByTestId('sendbird-separator').className).toContain('sendbird-separator');
  });

  it('should do a snapshot test of the DateSeparator DOM', function () {
    const className = "example-classname";
    const { asFragment } = render(<DateSeparator className={className} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
