import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ThreadListItem from '../ThreadListItem';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../../lib/LocalizationContext';
import { useDirtyGetMentions } from '../../../../Message/hooks/useDirtyGetMentions';
import useThread from '../../../context/useThread';
import { ThreadListStateTypes } from '../../../types';

jest.mock('date-fns/format', () => () => 'thread-date');
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
jest.mock('../../../context/useThread', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../../ui/DateSeparator', () => (props: any) => <div data-testid="date-separator">{props.children}</div>);
jest.mock('../../RemoveMessageModal', () => (props: any) => (
  <button type="button" data-testid="remove-modal" onClick={props.onCancel}>remove</button>
));
jest.mock('../../../../../ui/FileViewer', () => (props: any) => (
  <div data-testid="file-viewer">
    <button type="button" data-testid="download" onClick={(event) => props.onDownloadClick(event)}>download</button>
    <button type="button" data-testid="delete-file" onClick={props.onDelete}>delete</button>
    <button type="button" data-testid="close-file" onClick={props.onClose}>close</button>
  </div>
));
jest.mock('../../../../../ui/MessageInput', () => (props: any) => (
  <div data-testid="edit-input">
    <button type="button" data-testid="start-typing" onClick={props.onStartTyping}>start</button>
    <button type="button" data-testid="mention-change" onClick={() => props.onMentionStringChange('@bo')}>mention</button>
    <button type="button" data-testid="fetch-key" onClick={() => props.onKeyDown({ key: 'Enter' })}>key</button>
    <button type="button" data-testid="mentioned-ids" onClick={() => props.onMentionedUserIdsUpdated(['user-b'])}>ids</button>
    <button type="button" data-testid="user-mentioned" onClick={() => props.onUserMentioned({ userId: 'user-b' })}>user</button>
    <button
      type="button"
      data-testid="update"
      onClick={() => props.onUpdateMessage({ messageId: props.message.messageId, message: 'edited', mentionTemplate: '@bo edited' })}
    >
      update
    </button>
    <button type="button" data-testid="cancel" onClick={props.onCancelEdit}>cancel</button>
  </div>
));
jest.mock('../../SuggestedMentionList', () => (props: any) => (
  <div data-testid="mention-list">
    <button type="button" data-testid="fetch-users" onClick={() => props.onFetchUsers([{ userId: 'user-b', nickname: 'Bob' }])}>fetch</button>
    <button type="button" data-testid="select-user" onClick={() => props.onUserItemClick({ userId: 'user-b', nickname: 'Bob' })}>select</button>
    <button type="button" data-testid="focus-user" onClick={props.onFocusItemChange}>focus</button>
    {props.targetNickname}:{String(props.ableAddMention)}
  </div>
));
jest.mock('../ThreadListItemContent', () => (props: any) => (
  <div data-testid="item-content">
    <button type="button" data-testid="show-edit" onClick={() => props.showEdit(true)}>edit</button>
    <button type="button" data-testid="show-remove" onClick={() => props.showRemove(true)}>remove</button>
    <button type="button" data-testid="show-file" onClick={() => props.showFileViewer(true)}>file</button>
    {props.userId}:{props.message.messageId}:{String(props.isReactionEnabled)}
  </div>
));

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};
const channel = {
  url: 'channel-url',
  myRole: 'operator',
  startTyping: jest.fn(),
  endTyping: jest.fn(),
};
const message = {
  messageId: 20,
  createdAt: 2000,
  message: 'thread message',
  reactions: [],
  sender: { userId: 'me' },
  isUserMessage: () => true,
};

const actions = {
  toggleReaction: jest.fn(),
  updateMessage: jest.fn(),
  resendMessage: jest.fn(),
  deleteMessage: jest.fn(),
};

const setup = (overrides = {}) => {
  jest.clearAllMocks();
  Element.prototype.scrollIntoView = jest.fn();
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      stores: {
        userStore: {
          user: { userId: 'me' },
        },
      },
      config: {
        isOnline: true,
        userMention: {
          maxMentionCount: 3,
          maxSuggestionCount: 5,
        },
        logger,
        groupChannel: {
          enableMention: true,
          replyType: 'THREAD',
        },
      },
    },
  });
  (useLocalization as jest.Mock).mockReturnValue({
    dateLocale: {},
    stringSet: {
      DATE_FORMAT__THREAD_LIST__DATE_SEPARATOR: 'PP',
    },
  });
  (useDirtyGetMentions as jest.Mock).mockReturnValue([]);
  (useThread as jest.Mock).mockReturnValue({
    state: {
      message,
      currentChannel: channel,
      nicknamesMap: new Map(),
      emojiContainer: { emojiCategories: [] },
      threadListState: ThreadListStateTypes.INITIALIZED,
      isMuted: false,
      isChannelFrozen: false,
      onBeforeDownloadFileMessage: jest.fn().mockResolvedValue(false),
      ...overrides,
    },
    actions,
  });
};

describe('ThreadListItem', () => {
  beforeEach(() => {
    setup();
  });

  it('renders separators, scrolls to the opening message, and handles remove/file viewer actions', async () => {
    const handleScroll = jest.fn();
    const onBeforeDownloadFileMessage = jest.fn()
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error('decision failed'));
    setup({ onBeforeDownloadFileMessage });

    render(
      <ThreadListItem
        message={message as any}
        hasSeparator
        className="custom-item"
        handleScroll={handleScroll}
      />,
    );

    expect(screen.getByTestId('sendbird-thread-list-item')).toHaveClass('custom-item');
    expect(screen.getByTestId('date-separator')).toHaveTextContent('thread-date');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'center', inline: 'center' });

    fireEvent.click(screen.getByTestId('show-remove'));
    expect(screen.getByTestId('remove-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('remove-modal'));
    expect(screen.queryByTestId('remove-modal')).toBeNull();

    fireEvent.click(screen.getByTestId('show-file'));
    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith('ThreadListItem: Not allowed to download.');
    });
    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'ThreadListItem: Error occurred while determining download continuation:',
        expect.any(Error),
      );
    });
    fireEvent.click(screen.getByTestId('delete-file'));
    expect(actions.deleteMessage).toHaveBeenCalledWith(message);
    expect(screen.queryByTestId('file-viewer')).toBeNull();
  });

  it('updates and cancels messages through the edit input with mention selection', () => {
    render(<ThreadListItem message={message as any} />);

    fireEvent.click(screen.getByTestId('show-edit'));
    expect(screen.getByTestId('edit-input')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('start-typing'));
    expect(channel.startTyping).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('mention-change'));
    expect(screen.getByTestId('mention-list')).toHaveTextContent('@bo:true');
    fireEvent.click(screen.getByTestId('fetch-users'));
    fireEvent.click(screen.getByTestId('fetch-key'));
    fireEvent.click(screen.getByTestId('select-user'));
    fireEvent.click(screen.getByTestId('user-mentioned'));
    fireEvent.click(screen.getByTestId('mentioned-ids'));
    fireEvent.click(screen.getByTestId('update'));

    expect(actions.updateMessage).toHaveBeenCalledWith({
      messageId: 20,
      message: 'edited',
      mentionedUsers: [{ userId: 'user-b', nickname: 'Bob' }],
      mentionTemplate: '@bo edited',
    });
    expect(channel.endTyping).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('show-edit'));
    fireEvent.click(screen.getByTestId('mention-change'));
    fireEvent.click(screen.getByTestId('cancel'));
    expect(screen.queryByTestId('edit-input')).toBeNull();
  });

  it('renders a custom separator and disables the edit input from thread state', () => {
    setup({
      threadListState: ThreadListStateTypes.NIL,
      isMuted: true,
      isChannelFrozen: true,
    });
    render(
      <ThreadListItem
        message={message as any}
        hasSeparator
        renderCustomSeparator={({ message }) => <div data-testid="custom-separator">{message.messageId}</div>}
      />,
    );

    expect(screen.getByTestId('custom-separator')).toHaveTextContent('20');
    fireEvent.click(screen.getByTestId('show-edit'));
    expect(screen.getByTestId('edit-input')).toBeInTheDocument();
  });
});
