import React from 'react';
import { render } from '@testing-library/react';

import TextButton from "../index";

describe('ui/TextButton', () => {
  it('should contain the className', function () {
    const className = "example-classname";
    const { container } = render(<TextButton className={className}>Textbutton</TextButton>);

    expect(
      container.getElementsByClassName('sendbird-textbutton')
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the TextButton DOM', function () {
    const { asFragment } = render(<TextButton>Textbutton</TextButton>);
    expect(asFragment()).toMatchSnapshot();
  });
});
