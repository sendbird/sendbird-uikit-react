import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import MessageView from '../MessageView';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../../lib/LocalizationContext';
import { useDirtyGetMentions } from '../../../../Message/hooks/useDirtyGetMentions';
import { ThreadReplySelectType } from '../../../context/const';

jest.mock('date-fns/format', () => () => 'formatted-date');
jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));
jest.mock('../../../../Message/hooks/useDirtyGetMentions', () => ({
  useDirtyGetMentions: jest.fn(),
}));
jest.mock('../../../../../ui/MessageInput', () => (props: any) => (
  <div data-testid="edit-input">
    <button type="button" data-testid="start-typing" onClick={props.onStartTyping}>start</button>
    <button type="button" data-testid="mention-change" onClick={() => props.onMentionStringChange('@al')}>mention</button>
    <button
      type="button"
      data-testid="edit-keydown"
      onClick={() => props.onKeyDown({ key: 'Enter', preventDefault: jest.fn() })}
    >
      key
    </button>
    <button type="button" data-testid="mentioned-ids" onClick={() => props.onMentionedUserIdsUpdated(['user-a'])}>ids</button>
    <button type="button" data-testid="user-mentioned" onClick={() => props.onUserMentioned({ userId: 'user-a' })}>user</button>
    <button
      type="button"
      data-testid="update"
      onClick={() => props.onUpdateMessage({ messageId: props.message.messageId, message: 'edited', mentionTemplate: '@al edited' })}
    >
      update
    </button>
    <button type="button" data-testid="cancel" onClick={props.onCancelEdit}>cancel</button>
  </div>
));
jest.mock('../../SuggestedReplies', () => (props: any) => (
  <button type="button" data-testid="suggested-replies" onClick={() => props.onSendMessage({ message: props.replyOptions[0] ?? 'yes' })}>
    {props.type}:{props.replyOptions.join(',')}
  </button>
));
jest.mock('../../SuggestedMentionList/SuggestedMentionListView', () => (props: any) => (
  <div data-testid="mention-list">
    <button type="button" data-testid="fetch-users" onClick={() => props.onFetchUsers([{ userId: 'user-a', nickname: 'Alice' }])}>fetch</button>
    <button type="button" data-testid="select-user" onClick={() => props.onUserItemClick({ userId: 'user-a', nickname: 'Alice' })}>select</button>
    <button type="button" data-testid="focus-user" onClick={props.onFocusItemChange}>focus</button>
    {props.targetNickname}:{String(props.ableAddMention)}
  </div>
));
jest.mock('../../../../../ui/DateSeparator', () => (props: any) => <div data-testid="date-separator">{props.children}</div>);
jest.mock('../../../../../ui/NewMessageSeparator', () => (props: any) => (
  <button type="button" data-testid="new-message" onClick={() => props.onVisibilityChange?.(true)}>{props.children}</button>
));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const createMessage = (overrides = {}) => ({
  messageId: 10,
  createdAt: 1000,
  updatedAt: 1000,
  message: 'hello',
  reactions: [],
  suggestedReplies: ['yes', 'no'],
  isUserMessage: () => true,
  ...overrides,
});

const channel = {
  url: 'channel-url',
  isFrozen: false,
  myMutedState: 'unmuted',
  startTyping: jest.fn(),
  endTyping: jest.fn(),
};

const baseProps = {
  message: createMessage(),
  channel: channel as any,
  emojiContainer: { emojiCategories: [] } as any,
  editInputDisabled: false,
  shouldRenderSuggestedReplies: true,
  isReactionEnabled: true,
  replyType: 'THREAD' as any,
  threadReplySelectType: ThreadReplySelectType.PARENT,
  nicknamesMap: new Map(),
  scrollToMessage: jest.fn(),
  toggleReaction: jest.fn(),
  setQuoteMessage: jest.fn(),
  sendUserMessage: jest.fn(),
  updateUserMessage: jest.fn(),
  resendMessage: jest.fn(),
  deleteMessage: jest.fn().mockResolvedValue(undefined),
  markAsUnread: jest.fn(),
  renderFileViewer: jest.fn(({ onCancel }) => <button type="button" data-testid="file-viewer" onClick={onCancel}>file-viewer</button>),
  renderRemoveMessageModal: jest.fn(({ onCancel }) => <button type="button" data-testid="remove-modal" onClick={onCancel}>remove</button>),
  animatedMessageId: null,
  setAnimatedMessageId: jest.fn(),
};

const setup = () => {
  jest.clearAllMocks();
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      config: {
        userId: 'me',
        isOnline: true,
        logger,
        userMention: {
          maxMentionCount: 3,
          maxSuggestionCount: 5,
        },
        groupChannel: {
          enableMention: true,
          suggestedRepliesDirection: 'vertical',
        },
      },
    },
  });
  (useLocalization as jest.Mock).mockReturnValue({
    dateLocale: {},
    stringSet: {
      DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR: 'PP',
    },
  });
  (useDirtyGetMentions as jest.Mock).mockReturnValue([]);
};

describe('GroupChannel MessageView', () => {
  beforeEach(() => {
    setup();
  });

  it('renders separators, suggested replies, modals, file viewer, and edit input callbacks', () => {
    const handleScroll = jest.fn();
    const onVisibilityChange = jest.fn();
    render(
      <MessageView
        {...baseProps}
        hasSeparator
        hasNewMessageSeparator
        handleScroll={handleScroll}
        onNewMessageSeparatorVisibilityChange={onVisibilityChange}
        renderCustomSeparator={({ message }) => <div data-testid="custom-separator">{message.messageId}</div>}
        renderMessageContent={(props) => (
          <div data-testid="content">
            <button type="button" data-testid="show-edit" onClick={() => props.showEdit?.(true)}>edit</button>
            <button type="button" data-testid="show-remove" onClick={() => props.showRemove?.(true)}>remove</button>
            <button type="button" data-testid="show-file" onClick={() => props.showFileViewer?.(true)}>file</button>
          </div>
        )}
      />,
    );

    expect(screen.getByTestId('custom-separator')).toHaveTextContent('10');
    fireEvent.click(screen.getByTestId('new-message'));
    expect(onVisibilityChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByTestId('suggested-replies'));
    expect(baseProps.sendUserMessage).toHaveBeenCalledWith({ message: 'yes' });

    fireEvent.click(screen.getByTestId('show-remove'));
    expect(screen.getByTestId('remove-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('remove-modal'));
    expect(screen.queryByTestId('remove-modal')).toBeNull();

    fireEvent.click(screen.getByTestId('show-file'));
    expect(screen.getByTestId('file-viewer')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('file-viewer'));
    expect(screen.queryByTestId('file-viewer')).toBeNull();

    fireEvent.click(screen.getByTestId('show-edit'));
    expect(screen.getByTestId('edit-input')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('start-typing'));
    expect(channel.startTyping).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('mention-change'));
    expect(screen.getByTestId('mention-list')).toHaveTextContent('@al:true');
    fireEvent.click(screen.getByTestId('fetch-users'));
    fireEvent.click(screen.getByTestId('edit-keydown'));
    fireEvent.click(screen.getByTestId('select-user'));
    fireEvent.click(screen.getByTestId('user-mentioned'));
    fireEvent.click(screen.getByTestId('mentioned-ids'));
    fireEvent.click(screen.getByTestId('update'));

    expect(baseProps.updateUserMessage).toHaveBeenCalledWith(10, {
      message: 'edited',
      mentionedUsers: [{ userId: 'user-a', nickname: 'Alice' }],
      mentionedMessageTemplate: '@al edited',
    });
    expect(channel.endTyping).toHaveBeenCalled();
  });

  it('supports canceling edit and default date separators', () => {
    render(
      <MessageView
        {...baseProps}
        hasSeparator
        renderMessageContent={(props) => (
          <button type="button" data-testid="show-edit" onClick={() => props.showEdit?.(true)}>edit</button>
        )}
      />,
    );

    expect(screen.getByTestId('date-separator')).toHaveTextContent('formatted-date');
    fireEvent.click(screen.getByTestId('show-edit'));
    fireEvent.click(screen.getByTestId('mention-change'));
    fireEvent.click(screen.getByTestId('cancel'));
    expect(screen.queryByTestId('edit-input')).toBeNull();
    expect(channel.endTyping).toHaveBeenCalled();
  });

  it('renders children and deprecated renderMessage overrides', () => {
    const { rerender } = render(
      <MessageView {...baseProps}>
        <div data-testid="children">children</div>
      </MessageView>,
    );
    expect(screen.getByTestId('children')).toBeInTheDocument();

    rerender(
      <MessageView
        {...baseProps}
        renderMessage={(props) => (
          <div data-testid="render-message">
            {props.message.messageId}:{props.currentChannel?.url}
          </div>
        )}
      />,
    );
    expect(screen.getByTestId('render-message')).toHaveTextContent('10:channel-url');
  });

  it('runs animation and new-message overflow effects', () => {
    jest.useFakeTimers();
    const setAnimatedMessageId = jest.fn();
    const onMessageAnimated = jest.fn();
    const scrollMessageOverflowToTop = jest.fn();
    const setNewMessageIds = jest.fn();

    render(
      <MessageView
        {...baseProps}
        animatedMessageId={10}
        setAnimatedMessageId={setAnimatedMessageId}
        onMessageAnimated={onMessageAnimated}
        newMessageIds={[10]}
        setNewMessageIds={setNewMessageIds}
        scrollMessageOverflowToTop={scrollMessageOverflowToTop}
        renderMessageContent={() => <div>content</div>}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('sendbird-message-view')).toHaveClass('sendbird-msg-hoc__animated');

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(setAnimatedMessageId).toHaveBeenCalledWith(null);
    expect(onMessageAnimated).toHaveBeenCalledTimes(1);

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(scrollMessageOverflowToTop).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ messageId: 10 }));
    expect(setNewMessageIds).toHaveBeenCalledWith([]);
    jest.useRealTimers();
  });
});
