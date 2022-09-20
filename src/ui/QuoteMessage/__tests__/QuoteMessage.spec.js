import React from 'react';
import { render } from '@testing-library/react';

import QuoteMessageItemBody from '../index';

describe('ui/QuoteMessage', () => {
  it('should do a snapshot test of the ReplyingMessageItemBody DOM', function() {
    const { asFragment } = render(
      <QuoteMessageItemBody
        message={{ sender: { nickname: 'Simon' } }}
        parentMessageType={null}
        parentMessageText="Hello nice to meet you"
        parentMessageUrl={''}
        parentMessageSender={{ nickname: 'Gabie' }}
        isByMe
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
