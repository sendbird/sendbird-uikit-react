import React from 'react';
import { render } from '@testing-library/react';

import Checkbox from "../index";

describe('ui/Checkbox', () => {
  it('should do a snapshot test of the default Checkbox DOM', function () {
    const { asFragment } = render(
      <Checkbox />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should do a snapshot test of the checked Checkbox DOM', function () {
    const { asFragment } = render(
      <Checkbox checked={true} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
