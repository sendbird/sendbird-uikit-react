import React from 'react';
import { render, renderHook } from '@testing-library/react';

import MessageContent from "../index";
import { useMessageContext } from '../../../modules/Message/context/MessageProvider';
import { useLocalization } from '../../../lib/LocalizationContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

vi.mock('date-fns/format', () => ({ default: () => ('mock-date') }));

// to mock useSendbird
vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(),
  useSendbird: vi.fn(),
}));
vi.mock('../../../lib/LocalizationContext', () => {
  const React = require('react');
  return {
    __esModule: true,
    LocalizationContext: React.createContext({
      stringSet: {
        DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
      },
    }),
    useLocalization: vi.fn(),
  };
});
vi.mock('../../../modules/Message/context/MessageProvider', () => ({
  __esModule: true,
  useMessageContext: vi.fn(),
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
      state: {
        config: {
          groupChannel: {
            enableOgtag: true,
          }
        },
        eventHandlers: {},
      }
    };
    const localeContextValue = {
      dateLocale: {},
      stringSet: {
        DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
      },
    };
    const messageContextValue = {
      message: {},
    };

    // Mocking the hooks

    useSendbird.mockReturnValue(stateContextValue);
    useLocalization.mockReturnValue(localeContextValue);
    useMessageContext.mockReturnValue(messageContextValue);

    renderHook(() => useSendbird());
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
      state: {
        config: {
          groupChannel: { enableOgtag: true },
        }
      }
    };
    useSendbird.mockReturnValue(contextValue);
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
      state: {
        config: {
          groupChannel: { enableOgtag: false },
        }
      }
    };
    useSendbird.mockReturnValue(contextValue);
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

    // then TextMessageItemBody should be rendered instead
    expect(
      container.querySelector('.sendbird-text-message-item-body')
    ).toBeTruthy();
  });

  // CLNP-8803 / C1
  //
  // chainTop/chainBottom are public props, so an app with a custom MessageList computes
  // them itself and bypasses compareMessagesForGrouping's guard. This component trusted
  // the incoming value and dropped the status block entirely, which is how an undelivered
  // message ended up with no timestamp, no spinner and no error icon at all.
  describe('undelivered status survives grouping', () => {
    const renderWithChain = (sendingStatus, chainBottom) => render(
      <MessageContent
        userId="user-id-001"
        message={createMockMessage((m) => ({ ...m, sendingStatus }))}
        channel={createMockChannel()}
        chainBottom={chainBottom}
      />
    );

    it('renders the status of a pending message even when chained', () => {
      const { container } = renderWithChain('pending', true);
      expect(container.querySelector('.sendbird-message-status')).toBeTruthy();
    });

    it('renders the status of a failed message even when chained', () => {
      const { container } = renderWithChain('failed', true);
      expect(container.querySelector('.sendbird-message-status')).toBeTruthy();
    });

    it('still hides the status of a chained succeeded message', () => {
      const { container } = renderWithChain('succeeded', true);
      expect(container.querySelector('.sendbird-message-status')).toBe(null);
    });

    it('still shows the status of an unchained succeeded message', () => {
      const { container } = renderWithChain('succeeded', false);
      expect(container.querySelector('.sendbird-message-status')).toBeTruthy();
    });

    it('leaves the incoming-message chain behaviour alone', () => {
      // A message from someone else can never be pending or failed, so the chained
      // created-at block must keep following chainBottom exactly as before.
      const { container } = render(
        <MessageContent
          userId="another-user"
          message={createMockMessage()}
          channel={createMockChannel()}
          chainBottom
        />
      );
      expect(
        container.querySelector('.sendbird-message-content__middle__body-container__created-at')
      ).toBe(null);
    });
  });
});
