import React, { useContext } from 'react';
import { render, renderHook } from '@testing-library/react';

import MessageContent from "../index";
import { useMessageContext } from '../../../modules/Message/context/MessageProvider';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../lib/LocalizationContext';

jest.mock('date-fns/format', () => () => ('mock-date'));

// to mock useSendbirdStateContext
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
jest.mock('../../../lib/LocalizationContext', () => ({
  ...jest.requireActual('../../../lib/LocalizationContext'),
  useLocalization: jest.fn(),
}));
jest.mock('../../../modules/Message/context/MessageProvider', () => ({
  ...jest.requireActual('../../../modules/Message/context/MessageProvider'),
  useMessageContext: jest.fn(),
}));

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
  /** Mocking necessary hooks */
  beforeEach(() => {
    const stateContextValue = {
      config: {
        groupChannel: {
          enableOgtag: true,
        }
      }
    };
    const localeContextValue = {
      dateLocale: {},
    };
    const messageContextValue = {
      message: {},
    }

    useContext.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);
    useMessageContext.mockReturnValue(messageContextValue)

    renderHook(() => useSendbirdStateContext());
    renderHook(() => useLocalization());
    renderHook(() => useMessageContext());
  })
  // TODO: Add tests after message threading is applied
  // useReplying <-> replyType
  // it('should render components by replyType', () => {});

  it('should have class names by own user basic status', () => {
    const className = "test-classname";
    const message = createMockMessage();
    const { container } = render(
      <MessageContent
        className={className}
        userId="sendbird-user-000"
        message={message}
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
    const message = createMockMessage();
    const { container } = render(
      <MessageContent
        userId="user-id-001"
        message={message}
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
    const message = createMockMessage();
    const { container } = render(
      <MessageContent
        userId="user-id-002"
        message={message}
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
    const message = createMockMessage();
    const { container } = render(
      <MessageContent
        userId="sendbird-user-000"
        message={message}
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
    const message = createMockMessage();
    const { container } = render(
      <MessageContent
        userId="sendbird-user-001"
        message={message}
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
    const message = createMockMessage();
    const { container } = render(
      <MessageContent
        userId="sendbird-user-002"
        message={message}
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
    const message = createMockMessage();
    const { asFragment }  = render(
      <MessageContent
        className="classname-for-snapshot"
        message={message}
        channel={createMockChannel()}
        userId="user-id-000"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render OGMessageItemBody if config.groupChannel.enableOgtag == true', function () {
    const message = createMockMessage();
    const contextValue = {
      config: {
        groupChannel: { enableOgtag: true },
      }
    };
    useContext.mockReturnValue(contextValue);
    const { container } = render(
      <MessageContent
        className="classname-for-snapshot"
        message={{
          ...message,
          ogMetaData: { url: 'test' },
        }}
        channel={createMockChannel()}
        userId="user-id-000"
      />
    );
    expect(
      container.querySelector('.sendbird-og-message-item-body')
    ).toBeTruthy();
  });

  it('should not render OGMessageItemBody if config.groupChannel.enableOgtag == false', function () {
    const message = createMockMessage();
    const contextValue = {
      config: {
        groupChannel: { enableOgtag: false },
      }
    };
    useContext.mockReturnValue(contextValue);
    const { container } = render(
      <MessageContent
        className="classname-for-snapshot"
        message={{
          ...message,
          ogMetaData: { url: 'test' },
        }}
        channel={createMockChannel()}
        userId="user-id-000"
      />
    );
    expect(
      container.querySelector('.sendbird-og-message-item-body')
    ).toBe(null);
  });
});
