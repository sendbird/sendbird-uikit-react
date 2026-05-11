import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import QuoteMessageItemBody from '../index';

const parentMessage = {
  messageId: 1,
  messageType: 'user',
  message: 'parent message',
  sender: {
    userId: 'parent',
    nickname: 'Parent user',
  },
};

const replyMessage = {
  sender: {
    userId: 'reply',
    nickname: 'Reply user',
  },
  parentMessage,
};

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

  it('calls click handlers while the quoted parent message is available', () => {
    const onClick = jest.fn();
    render(
      <QuoteMessageItemBody
        message={replyMessage}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByText('parent message'));
    fireEvent.touchEnd(screen.getByText('parent message'));

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not route clicks when the quoted parent message is unavailable', () => {
    const onClick = jest.fn();
    render(
      <QuoteMessageItemBody
        message={replyMessage}
        isUnavailable
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByText('Message unavailable'));
    fireEvent.touchEnd(screen.getByText('Message unavailable'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
