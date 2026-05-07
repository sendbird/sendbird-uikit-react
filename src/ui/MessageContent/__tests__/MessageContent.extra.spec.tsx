import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MessageContent from '..';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../lib/MediaQueryContext';
import { MESSAGE_TEMPLATE_KEY } from '../../../utils/consts';
import { ThreadReplySelectType } from '../../../modules/Channel/context/const';

jest.mock('date-fns/format', () => () => 'formatted-date');
jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));
jest.mock('../../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: jest.fn(),
}));
jest.mock('../../../hooks/useElementObserver', () => jest.fn(() => true));
jest.mock('../../../hooks/useLongPress', () => jest.fn((handlers) => ({
  onMouseDown: handlers.onLongPress,
  onClick: handlers.onClick,
})));
jest.mock('../../AdminMessage', () => (props: any) => <div data-testid="admin-message">{props.message.message}</div>);
jest.mock('../../QuoteMessage', () => (props: any) => (
  <button type="button" data-testid="quote-message" onClick={props.onClick}>
    quote {String(props.isUnavailable)}
  </button>
));
jest.mock('../../ThreadReplies', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => React.createElement(
    'button',
    {
      type: 'button',
      'data-testid': 'thread-replies',
      ref,
      onClick: props.onClick,
    },
    `replies ${props.threadInfo.replyCount}`,
  ));
});
jest.mock('../MessageContentForTemplateMessage', () => ({
  MessageContentForTemplateMessage: (props: any) => (
    <div data-testid="template-message">
      {props.templateType} {String(props.isByMe)} {String(props.displayThreadReplies)}
    </div>
  ),
}));
jest.mock('../../MessageFeedbackFailedModal', () => (props: any) => (
  <button type="button" data-testid="feedback-failed" onClick={props.onCancel}>{props.text}</button>
));

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};

const baseChannel = {
  isEphemeral: false,
  messageOffsetTimestamp: 0,
  isGroupChannel: () => true,
  isSuper: false,
  getUnreadMemberCount: jest.fn(() => 0),
  getUndeliveredMemberCount: jest.fn(() => 0),
};

const createMessage = (overrides = {}) => ({
  messageId: 100,
  messageType: 'user',
  message: 'hello',
  createdAt: 1000,
  reactions: [],
  parentMessageId: 0,
  parentMessage: null,
  sender: {
    userId: 'other',
    nickname: 'Other',
    profileUrl: '',
  },
  threadInfo: {
    replyCount: 0,
  },
  sendingStatus: 'succeeded',
  isAdminMessage: () => false,
  isUserMessage: () => true,
  isFileMessage: () => false,
  isMultipleFilesMessage: () => false,
  ...overrides,
});

const setup = ({ isMobile = false } = {}) => {
  jest.clearAllMocks();
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      config: {
        logger,
        groupChannel: {
          enableOgtag: true,
        },
      },
      eventHandlers: {
        reaction: {
          onPressUserProfile: jest.fn(),
        },
      },
    },
  });
  (useLocalization as jest.Mock).mockReturnValue({
    dateLocale: {},
    stringSet: {
      DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
      FEEDBACK_FAILED_DELETE: 'delete failed',
      FEEDBACK_FAILED_SAVE: 'save failed',
      FEEDBACK_FAILED_SUBMIT: 'submit failed',
    },
  });
  (useMediaQueryContext as jest.Mock).mockReturnValue({ isMobile });
};

describe('MessageContent extra branches', () => {
  beforeEach(() => {
    setup();
  });

  it('renders admin and valid template messages through their early-return branches', () => {
    const { rerender } = render(
      <MessageContent
        userId="me"
        channel={baseChannel as any}
        message={createMessage({ messageType: 'admin', isAdminMessage: () => true, message: 'admin text' }) as any}
      />,
    );
    expect(screen.getByTestId('admin-message')).toHaveTextContent('admin text');

    rerender(
      <MessageContent
        userId="me"
        channel={baseChannel as any}
        replyType="THREAD"
        message={createMessage({
          sender: { userId: 'me' },
          threadInfo: { replyCount: 2 },
          extendedMessagePayload: {
            [MESSAGE_TEMPLATE_KEY]: { type: 'default' },
          },
        }) as any}
      />,
    );
    expect(screen.getByTestId('template-message')).toHaveTextContent('default true true');
  });

  it('renders quote, reactions, thread replies, and invokes renderer callbacks', () => {
    const scrollToMessage = jest.fn();
    const onReplyInThread = jest.fn();
    const onQuoteMessageClick = jest.fn();
    const toggleReaction = jest.fn();
    const setQuoteMessage = jest.fn();
    const message = createMessage({
      parentMessageId: 50,
      parentMessage: { messageId: 50, createdAt: 500 },
      threadInfo: { replyCount: 3 },
      reactions: [{ key: 'smile', userIds: ['me'] }],
    });
    render(
      <MessageContent
        userId="other"
        channel={baseChannel as any}
        message={message as any}
        replyType="THREAD"
        threadReplySelectType={ThreadReplySelectType.THREAD}
        isReactionEnabled
        scrollToMessage={scrollToMessage}
        onReplyInThread={onReplyInThread}
        onQuoteMessageClick={onQuoteMessageClick}
        toggleReaction={toggleReaction}
        setQuoteMessage={setQuoteMessage}
        renderSenderProfile={(props) => <div data-testid="profile">{props.bottom}</div>}
        renderMessageHeader={() => <div data-testid="header">header</div>}
        renderMessageBody={(props) => <div data-testid="body">{String(props.isReactionEnabledInChannel)}</div>}
        renderMessageMenu={(props) => (
          <button type="button" data-testid={`menu-${props.className ?? 'left'}`} onClick={() => props.onReplyInThread?.({ message: message as any })}>
            menu
          </button>
        )}
        renderEmojiMenu={(props) => (
          <button type="button" data-testid={`emoji-menu-${props.className ?? 'left'}`} onClick={() => props.toggleReaction?.(message as any, 'smile', true)}>
            emoji
          </button>
        )}
        renderEmojiReactions={(props) => (
          <button type="button" data-testid="emoji-reactions" onClick={() => props.toggleReaction?.(message as any, 'smile', true)}>
            reactions
          </button>
        )}
      />,
    );

    expect(screen.getByTestId('quote-message')).toHaveTextContent('quote false');
    expect(screen.getByTestId('body')).toHaveTextContent('true');
    expect(screen.getByTestId('emoji-reactions')).toBeInTheDocument();
    expect(screen.getByTestId('thread-replies')).toHaveTextContent('3');

    fireEvent.click(screen.getByTestId('quote-message'));
    fireEvent.click(screen.getByTestId('thread-replies'));
    fireEvent.click(screen.getByTestId('menu-left'));
    fireEvent.click(screen.getByTestId('emoji-menu-left'));
    fireEvent.click(screen.getByTestId('emoji-reactions'));

    expect(onQuoteMessageClick).toHaveBeenCalledWith({ message });
    expect(onReplyInThread).toHaveBeenCalledWith({ message });
    expect(scrollToMessage).not.toHaveBeenCalled();
    expect(toggleReaction).toHaveBeenCalledWith(message, 'smile', true);
  });

  it('scrolls to parent quote when thread reply selection targets the parent message', () => {
    const scrollToMessage = jest.fn();
    const message = createMessage({
      parentMessageId: 77,
      parentMessage: { messageId: 77, createdAt: 770 },
    });

    render(
      <MessageContent
        userId="other"
        channel={{ ...baseChannel, messageOffsetTimestamp: 800 } as any}
        message={message as any}
        replyType="THREAD"
        threadReplySelectType={ThreadReplySelectType.PARENT}
        scrollToMessage={scrollToMessage}
        renderMessageBody={() => <div>body</div>}
        renderMessageMenu={(props) => (
          <button type="button" data-testid="parent-menu" onClick={() => props.onReplyInThread?.({ message: message as any })}>
            menu
          </button>
        )}
      />,
    );

    expect(screen.getByTestId('quote-message')).toHaveTextContent('true');
    fireEvent.click(screen.getByTestId('quote-message'));
    fireEvent.click(screen.getByTestId('parent-menu'));

    expect(scrollToMessage).toHaveBeenCalledWith(770, 77);
  });

  it('opens the mobile long-press menu and handles guarded downloads', async () => {
    setup({ isMobile: true });
    const onBeforeDownloadFileMessage = jest.fn()
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error('download decision failed'));
    const message = createMessage({
      sender: { userId: 'other' },
    });

    render(
      <MessageContent
        userId="me"
        channel={baseChannel as any}
        message={message as any}
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
        renderMessageBody={() => <div>mobile body</div>}
        renderMobileMenuOnLongPress={(props) => (
          <div data-testid="mobile-menu">
            <button type="button" data-testid="download" onClick={(event) => props.onDownloadClick?.(event as any)}>download</button>
            <button type="button" data-testid="hide" onClick={props.hideMenu}>hide</button>
          </div>
        )}
      />,
    );

    fireEvent.mouseDown(screen.getByTestId('sendbird-message-content__middle'));
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith('MessageContent: Not allowed to download.');
    });

    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'MessageContent: Error occurred while determining download continuation:',
        expect.any(Error),
      );
    });

    fireEvent.click(screen.getByTestId('hide'));
    expect(screen.queryByTestId('mobile-menu')).toBeNull();
  });
});
