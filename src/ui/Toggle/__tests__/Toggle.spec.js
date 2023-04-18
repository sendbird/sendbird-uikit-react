import React from 'react';
import { render } from '@testing-library/react';

import Toggle from "../index";

describe('Toggle', () => {
  it('should do a snapshot test of the Toggle DOM', function() {
    const { asFragment } = render(<Toggle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
