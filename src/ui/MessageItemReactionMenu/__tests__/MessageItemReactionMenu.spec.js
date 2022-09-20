import React from 'react';
import { render } from '@testing-library/react';

import MessageItemReactionMenu from "../index";

describe('ui/MessageItemReactionMenu', () => {
  it('should do a snapshot test of the MessageItemReactionMenu DOM', function() {
    const { asFragment } = render(
      <MessageItemReactionMenu
        message={{ sendingStatus: 'succeeded' }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
