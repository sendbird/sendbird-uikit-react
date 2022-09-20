import React from 'react';
import { render } from '@testing-library/react';

import QuoteMessageInput from "../index";
import { dummyFileMessageAudio } from '../mockMessage.ts';

describe('ui/QuoteMessageInput', () => {
  it('should do a snapshot test of the QuoteMessageInput DOM', function() {
    const { asFragment } = render(<QuoteMessageInput replyingMessage={dummyFileMessageAudio} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
