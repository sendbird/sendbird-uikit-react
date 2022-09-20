import React from 'react';
import { render } from '@testing-library/react';

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

describe('ui/MessageContent', () => {
  // TODO: Add tests after message threading is applied
  // useReplying <-> replyType
  // it('should render components by replyType', () => {});

  it('should have class names by own user basic status', () => {
    const className = "test-classname";
    const { container, queryByTestId } = render(
      <MessageContent
        className={className}
        userId="sendbird-user-000"
        message={createMockMessage()}
        channel={createMockChannel()}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-message-content')[0].className
    ).toContain(className);
    expect(
      container.getElementsByClassName('sendbird-message-content__left').length
    ).toBeGreaterThan(0);
    expect(
      container.getElementsByClassName('sendbird-message-content__middle').length
    ).toBeGreaterThan(0);
    expect(
      container.getElementsByClassName('sendbird-message-content__right').length
    ).toBeGreaterThan(0);
    expect(
      container.getElementsByClassName('sendbird-message-content__left__avatar').length
    ).toBeGreaterThan(0);
    expect(
      container.querySelector('.sendbird-message-content__middle__body-container__created-at.left')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content-menu.outgoing')
    ).toBeNull();
    expect(
      container.getElementsByClassName('sendbird-message-content__middle__sender-name').length
    ).toBeGreaterThan(0);
    expect(
      container.getElementsByClassName('sendbird-message-content-reactions').length
    ).toBe(0);
    expect(
      container.querySelector('.sendbird-message-content__right.chain-top')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content__middle__body-container__created-at.right')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content-menu.incoming')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content-menu.chain-top')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content-menu.outgoing .sendbird-message-content-menu__normal-menu')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content-menu.outgoing .sendbird-message-content-menu__reaction-menu')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content-menu.incoming .sendbird-message-content-menu__normal-menu')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content-menu.incoming .sendbird-message-content-menu__reaction-menu')
    ).toBeNull();
  });

  it('should render components when isByMe is true', () => {
    const { container } = render(
      <MessageContent
        userId="user-id-001"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe
      />
    );
    expect(
      container.querySelector('.sendbird-message-content.outgoing')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content__left.outgoing')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content-menu.outgoing')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content.incoming')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content__left.incoming')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content-menu.incoming')
    ).toBeNull();
  });
  it('should render components when isByMe is false', () => {
    const { container } = render(
      <MessageContent
        userId="user-id-002"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe={false}
      />
    );
    expect(
      container.querySelector('.sendbird-message-content.outgoing')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content__left.outgoing')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content-menu.outgoing')
    ).toBeNull();
    expect(
      container.querySelector('.sendbird-message-content.incoming')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content__left.incoming')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content-menu.incoming')
    ).toBeTruthy();
  });

  it('should not render components when chainTop is true', () => {
    const { container } = render(
      <MessageContent
        userId="sendbird-user-000"
        message={createMockMessage()}
        channel={createMockChannel()}
        chainTop
      />
    );
    expect(
      container.getElementsByClassName('sendbird-message-content__middle__sender-name').length
    ).toBe(0);
    expect(
      container.querySelector('.sendbird-message-content__right.chain-top')
    ).toBeTruthy();
    expect(
      container.querySelector('.sendbird-message-content-menu.chain-top')
    ).toBeTruthy();
  });

  it('should not render components when chainBottom is true & isByMe is true', () => {
    const { container } = render(
      <MessageContent
        userId="sendbird-user-001"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe
        chainBottom
      />
    );
    expect(
      container.getElementsByClassName('sendbird-message-content__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-message-content__middle__body-container__created-at').length
    ).toBe(0);
  });
  it('should not render components when chainBottom is true & isByMe is false', () => {
    const { container } = render(
      <MessageContent
        userId="sendbird-user-002"
        message={createMockMessage()}
        channel={createMockChannel()}
        isByMe={false}
        chainBottom
      />
    );
    expect(
      container.getElementsByClassName('sendbird-message-content__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-message-content__middle__body-container__created-at').length
    ).toBe(0);
  });

  // it('should render components by isReactionEnabled and reactions', () => {});

  it('should do a snapshot test of the MessageContent DOM', function () {
    const { asFragment }  = render(
      <MessageContent
        className="classname-for-snapshot"
        message={createMockMessage()}
        channel={createMockChannel()}
        userId="user-id-000"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
