import React from 'react';
import { render } from '@testing-library/react';

import TextMessageItemBody from "../index";

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
    const { container } = render(
      <TextMessageItemBody
        className={insertingClassName}
        message={createMockMessage()}
      />
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
    const { container } = render(
      <TextMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.outgoing')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming')
    ).toHaveLength(0);
  });
  it('should have class name by isByMe is false', () => {
    const { container } = render(
      <TextMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming')
    ).toHaveLength(1);
  });

  it('should have class name by mouse hover prop', () => {
    const { container } = render(
      <TextMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.mouse-hover')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.incoming.mouse-hover')
    ).toHaveLength(1);
  });

  it('should have class name by reactions of message prop', () => {
    const { container } = render(
      <TextMessageItemBody
        isReactionEnabled
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          reactions: [{}, {}, {}],
        }))}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body.reactions')
    ).toHaveLength(1);
  });

  it('should have words component by split message', () => {
    const messageText = 'First second third fourth fifth';
    const { container } = render(
      <TextMessageItemBody
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          message: messageText,
        }))}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body__message.edited')
    ).toHaveLength(0);
  });
  it('should have words component by split message when message has updatedAt', () => {
    const messageText = 'First second third fourth fifth';
    const { container } = render(
      <TextMessageItemBody
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          message: messageText,
          updatedAt: 10101010,
        }))}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-text-message-item-body__message.edited')
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the TextMessageItemBody DOM', function () {
    const { asFragment } = render(
      <TextMessageItemBody
        className="class-name-for-snapshot"
        message={createMockMessage((mock) => ({
          ...mock,
          message: 'First second third fourth fifth',
          updatedAt: 1010,
          reactions: [{}, {}, {}],
        }))}
        isByMe
        mouseHover
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
