import React from 'react';
import { render } from '@testing-library/react';

import OpenChannelAdminMessage from "../index";

describe('OpenChannelAdminMessage', () => {
  it('should do a snapshot test of the OpenChannelAdminMessage DOM', function() {
    const { asFragment } = render(<OpenChannelAdminMessage message={{ message: 'Hello I am Admin' }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
