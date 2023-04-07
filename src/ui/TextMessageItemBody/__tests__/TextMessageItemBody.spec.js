import React from 'react';
import { render } from '@testing-library/react';

import TextMessageItemBody from "../index";
import { MessageProvider } from '../../../smart-components/Message/context/MessageProvider';

const createMockMessage = (process) => {
  const mockMessage = {
    message: '',
    updatedAt: 0,
    reactions: [],
    messageType: 'user',
    isUserMessage: () => true,
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('ui/TextMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const insertingClassName = 'test-class-name';
    const message = createMockMessage();
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          className={insertingClassName}
          message={message}
        />
      </MessageProvider>
    );
    expect(
      container.getElementsByClassName(insertingClassName)
    ).toHaveLength(1);
    expect(
      container.getElementsByClassName('sendbird-text-message-item-body')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.mouse-hover')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.reactions')
    ).toHaveLength(0);
    expect(
      container.getElementsByClassName('sendbird-text-message-item-body__message')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body__message.edited')
    ).toHaveLength(0);
  });

  it('should have class name by isByMe is true', () => {
    const message = createMockMessage();
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          message={message}
          isByMe
        />
      </MessageProvider>
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.outgoing')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming')
    ).toHaveLength(0);
  });
  it('should have class name by isByMe is false', () => {
    const message = createMockMessage();
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          message={message}
          isByMe={false}
        />
      </MessageProvider>
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming')
    ).toHaveLength(1);
  });

  it('should have class name by mouse hover prop', () => {
    const message = createMockMessage();
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          message={message}
          mouseHover
        />
      </MessageProvider>
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.mouse-hover')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming.mouse-hover')
    ).toHaveLength(1);
  });

  it('should have class name by reactions of message prop', () => {
    const message = createMockMessage((mockMessage) => ({
      ...mockMessage,
      reactions: [{}, {}, {}],
    }))
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          isReactionEnabled
          message={message}
        />
      </MessageProvider>
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.reactions')
    ).toHaveLength(1);
  });

  it('should have words component by split message', () => {
    const messageText = 'First second third fourth fifth';
    const message = createMockMessage((mockMessage) => ({
      ...mockMessage,
      message: messageText,
    }))
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          message={message}
        />
      </MessageProvider>
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body__message.edited')
    ).toHaveLength(0);
  });
  it('should have words component by split message when message has updatedAt', () => {
    const messageText = 'First second third fourth fifth';
    const message = createMockMessage((mockMessage) => ({
      ...mockMessage,
      message: messageText,
      updatedAt: 10101010,
    }))
    const { container } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          message={message}
        />
      </MessageProvider>
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body__message.edited')
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the TextMessageItemBody DOM', function () {
    const message = createMockMessage((mock) => ({
      ...mock,
      message: 'First second third fourth fifth',
      updatedAt: 1010,
      reactions: [{}, {}, {}],
    }))
    const { asFragment } = render(
      <MessageProvider message={message}>
        <TextMessageItemBody
          className="class-name-for-snapshot"
          message={message}
          isByMe
          mouseHover
        />
      </MessageProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
