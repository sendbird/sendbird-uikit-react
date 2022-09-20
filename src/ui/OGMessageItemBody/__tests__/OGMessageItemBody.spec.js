import React from 'react';
import { render } from '@testing-library/react';

import OGMessageItemBody from "../index";

describe('ui/OGMessageItemBody', () => {
  it('should do a snapshot test of the OGMessageItemBody DOM', function() {
    const text = "example-text";
    const { asFragment } = render(<OGMessageItemBody />);
    expect(asFragment()).toMatchSnapshot();
  });
});
