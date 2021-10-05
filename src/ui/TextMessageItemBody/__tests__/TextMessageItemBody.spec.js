import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

describe('TextMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const insertingClassName = 'test-class-name';
    const component = mount(
      <TextMessageItemBody
        className={insertingClassName}
        message={createMockMessage()}
      />
    );
    expect(
      component.find(`.${insertingClassName}`).hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-text-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-text-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-text-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-text-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-text-message-item-body.reactions').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-text-message-item-body__message').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-text-message-item-body__message.edited').hostNodes().exists()
    ).toBe(false);
  });

  it('should have class name by isByMe prop', () => {
    const outgoingMessage = mount(
      <TextMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      outgoingMessage.find('.sendbird-text-message-item-body.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-text-message-item-body.incoming').hostNodes().exists()
    ).toBe(false);
    const incomingMessage = mount(
      <TextMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      incomingMessage.find('.sendbird-text-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-text-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by mouse hover prop', () => {
    const component = mount(
      <TextMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      component.find('.sendbird-text-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-text-message-item-body.incoming.mouse-hover').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by reactions of message prop', () => {
    const component = mount(
      <TextMessageItemBody
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          reactions: [{}, {}, {}],
        }))}
      />
    );
    expect(
      component.find('.sendbird-text-message-item-body.reactions').hostNodes().exists()
    ).toBe(true);
  });

  it('should have words component by split message', () => {
    const messageText = 'First second third fourth fifth';
    const component = mount(
      <TextMessageItemBody
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          message: messageText,
        }))}
      />
    );
    expect(
      component.find('.sendbird-text-message-item-body__message').hostNodes().length
    ).toBe(messageText.split(/\r/).length);
    expect(
      component.find('.sendbird-text-message-item-body__message.edited').hostNodes().exists()
    ).toBe(false);
    const editedMessage = mount(
      <TextMessageItemBody
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          message: messageText,
          updatedAt: 10101010,
        }))}
      />
    );
    expect(
      editedMessage.find('.sendbird-text-message-item-body__message').hostNodes().length
    ).toBe(messageText.split(/\r/).length + 1);
    expect(
      editedMessage.find('.sendbird-text-message-item-body__message.edited').hostNodes().exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the TextMessageItemBody DOM', function () {
    const component = renderer.create(
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
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
