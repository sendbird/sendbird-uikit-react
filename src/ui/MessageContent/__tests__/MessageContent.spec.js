import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import MessageContent from "../index";
jest.mock('date-fns/format', () => () => ('mock-date'));

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

describe('MessageContent', () => {
  // TODO: Add tests after message threading is applied
  // useReplying <-> replyType
  // it('should render components by replyType', () => {});

  it('should have class names by own user basic status', () => {
    const component = mount(
      <MessageContent
        userId="sendbird-user-000"
        message={createMockMessage()}
        channel={createMockChannel()}
      />
    );
    expect(
      component.find('.sendbird-message-content').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content__left').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content__middle').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content__right').hostNodes().exists()
    ).toBe(true);

    expect(
      component.find('.sendbird-message-content__left__avatar').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content__middle__body-container__created-at.left').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content-menu.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content__middle__sender-name').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content-reactions').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content__right.chain-top').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content__middle__body-container__created-at.right').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content-menu.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content-menu.chain-top').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content-menu.outgoing .sendbird-message-content-menu__normal-menu').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content-menu.outgoing .sendbird-message-content-menu__reaction-menu').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content-menu.incoming .sendbird-message-content-menu__normal-menu').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content-menu.incoming .sendbird-message-content-menu__reaction-menu').hostNodes().exists()
    ).toBe(false);
  });

  it('should render components by isByMe prop', () => {
    const outgoingMessage = mount(
      <MessageContent
        userId="user-id-001"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe
      />
    );
    expect(
      outgoingMessage.find('.sendbird-message-content.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-message-content__left.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-message-content-menu.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-message-content.incoming').hostNodes().exists()
    ).toBe(false);
    expect(
      outgoingMessage.find('.sendbird-message-content__left.incoming').hostNodes().exists()
    ).toBe(false);
    expect(
      outgoingMessage.find('.sendbird-message-content-menu.incoming').hostNodes().exists()
    ).toBe(false);
    const incomingMessage = mount(
      <MessageContent
        userId="user-id-002"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe={false}
      />
    );
    expect(
      incomingMessage.find('.sendbird-message-content.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-message-content__left.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-message-content-menu.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-message-content.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      incomingMessage.find('.sendbird-message-content__left.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      incomingMessage.find('.sendbird-message-content-menu.incoming').hostNodes().exists()
    ).toBe(true);
  });

  it('should not render components when chainTop is true', () => {
    const component = mount(
      <MessageContent
        userId="sendbird-user-000"
        message={createMockMessage()}
        channel={createMockChannel()}
        chainTop
      />
    );
    expect(
      component.find('.sendbird-message-content__middle__sender-name').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-message-content__right.chain-top').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-message-content-menu.chain-top').hostNodes().exists()
    ).toBe(true);
  });

  it('should not render components when chainBottom is true', () => {
    const outgoingMessage = mount(
      <MessageContent
        userId="sendbird-user-001"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe
        chainBottom
      />
    );
    expect(
      outgoingMessage.find('.sendbird-message-content__left__avatar').hostNodes().exists()
    ).toBe(false);
    expect(
      outgoingMessage.find('.sendbird-message-content__middle__body-container__created-at').hostNodes().exists()
    ).toBe(false);
    const incomingMessage = mount(
      <MessageContent
        userId="sendbird-user-002"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe={false}
        chainBottom
      />
    );
    expect(
      incomingMessage.find('.sendbird-message-content__left__avatar').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-message-content__middle__body-container__created-at').hostNodes().exists()
    ).toBe(false);
  });

  // it('should render components by useReaction and reactions', () => {});

  it('should do a snapshot test of the MessageContent DOM', function () {
    const component = renderer.create(
      <MessageContent
        className="classname-for-snapshot"
        message={createMockMessage()}
        channel={createMockChannel()}
        userId="user-id-000"
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
