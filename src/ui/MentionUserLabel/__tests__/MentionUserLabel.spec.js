import React from 'react';
import { render } from '@testing-library/react';

import MentionUserLabel from "../index";

describe('ui/MentionUserLabel', () => {
  it('should do a snapshot test of the MentionUserLabel DOM', function() {
    const text = "example-text";
    const { asFragment } = render(<MentionUserLabel />);
    expect(asFragment()).toMatchSnapshot();
  });
});
