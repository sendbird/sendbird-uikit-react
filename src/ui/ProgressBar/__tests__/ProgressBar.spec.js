import React from 'react';
import { render } from '@testing-library/react';

import ProgressBar from "../index";

describe('ui/ProgressBar', () => {
  it('should should contain className', function () {
    const text = "example-text";
    const { container } = render(<ProgressBar className={text} />);
    expect(
      container.getElementsByClassName('sendbird-progress-bar')[0].className
    ).toContain('sendbird-progress-bar');
  });

  it('should do a snapshot test of the PlaceHolder DOM', function () {
    const text = "example-text";
    const { asFragment } = render(<ProgressBar className={text} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
