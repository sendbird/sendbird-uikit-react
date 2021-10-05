import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import MessageItemMenu from "../index";
import { MenuRoot } from '../../ContextMenu';

const createMockChannel = (process) => {
  const mockChannel = {
    isGroupChannel: () => true,
    getUnreadMemberCount: () => 1,
    getUndeliveredMemberCount: () => 1,
  };
  return process ? process(mockChannel) : mockChannel;
};
const createMockMessage = (process) => {
  const mockMessage = {
    messageId: 1010,
    messageType: 'user',
    message: 'First second third',
    url: '',
    name: '',
    type: '',
    thumbnails: [],
    reactions: [],
    sendingStatus: 'succeeded',
    parentMessageId: 0,
    parentMessageInfo: null,
    sender: {
      profileUrl: '',
      userId: 'user-id-001',
      nickname: 'Mathew',
    },
    threadInfo: {
      replyCount: 0,
    },
    isAdminMessage: () => false,
    isUserMessage: () => true,
    isFileMessage: () => false,
    isResendable: () => false,
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('MessageItemMenu', () => {
  jest.mock('date-fns/format', () => () => ('mock-date'));
  it('should have components by own basic status', () => {
    const className="class-name-for-test";
    const component = mount(
      <div>
        <MenuRoot />
        <MessageItemMenu
          className={className}
          message={createMockMessage()}
          channel={createMockChannel()}
          setSupposedHover={() => {
            console.log('무야호')
          }}
        />
      </div>
    );
    expect(
      component.find('.sendbird-message-item-menu').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find(`.${className}.sendbird-message-item-menu`).hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-item-menu__trigger').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-item-menu__trigger__icon').hostNodes().exists()
    ).toBe(true);
  });

  // TODO: Add tests with onClick events

  it('should do a snapshot test of the MessageItemMenu DOM', function() {
    const component = renderer.create(
      <MessageItemMenu
        className="classname-for-snapshot"
        message={createMockMessage()}
        channel={createMockChannel()}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
