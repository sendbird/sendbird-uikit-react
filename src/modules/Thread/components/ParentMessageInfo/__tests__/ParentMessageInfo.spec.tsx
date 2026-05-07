import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ParentMessageInfo from '..';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../../lib/MediaQueryContext';
import { useUserProfileContext } from '../../../../../lib/UserProfileContext';
import { useDirtyGetMentions } from '../../../../Message/hooks/useDirtyGetMentions';
import useThread from '../../../context/useThread';

jest.mock('date-fns/format', () => () => 'parent-date');
jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));
jest.mock('../../../../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: jest.fn(),
}));
jest.mock('../../../../../lib/UserProfileContext', () => ({
  useUserProfileContext: jest.fn(),
}));
jest.mock('../../../../Message/hooks/useDirtyGetMentions', () => ({
  useDirtyGetMentions: jest.fn(),
}));
jest.mock('../../../context/useThread', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../../utils/getIsReactionEnabled', () => ({
  getIsReactionEnabled: jest.fn(() => true),
}));
jest.mock('../../../../../hooks/useElementObserver', () => jest.fn(() => true));
jest.mock('../../../../../hooks/useLongPress', () => jest.fn((handlers) => ({
  onMouseDown: handlers.onLongPress,
})));
jest.mock('../../../../../ui/Avatar', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => React.createElement(
    'button',
    {
      type: 'button',
      'data-testid': 'avatar',
      ref,
      onClick: props.onClick,
    },
    props.alt,
  ));
});
jest.mock('../../../../../ui/UserProfile', () => (props: any) => <div data-testid="connected-profile">{props.user?.userId}</div>);
jest.mock('../../../../../ui/ContextMenu', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="context-menu">
      {props.menuTrigger(jest.fn())}
      {props.menuItems(jest.fn())}
    </div>
  ),
  MenuItems: (props: any) => <div data-testid="menu-items">{props.children}</div>,
  EMOJI_MENU_ROOT_ID: 'emoji-root',
  MENU_ROOT_ID: 'menu-root',
  MENU_OBSERVING_CLASS_NAME: 'observing',
  getObservingId: (id: number) => `observe-${id}`,
}));
jest.mock('../../../../../ui/MessageInput', () => (props: any) => (
  <div data-testid="edit-input">
    <button type="button" data-testid="start-typing" onClick={props.onStartTyping}>start</button>
    <button type="button" data-testid="mention-change" onClick={() => props.onMentionStringChange('@al')}>mention</button>
    <button type="button" data-testid="fetch-key" onClick={() => props.onKeyDown({ key: 'Enter' })}>key</button>
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
jest.mock('../ParentMessageInfoItem', () => (props: any) => (
  <button type="button" data-testid="parent-item" onClick={() => props.showFileViewer(true)}>
    {props.message.message}
  </button>
));
jest.mock('../../SuggestedMentionList', () => (props: any) => (
  <div data-testid="mention-list">
    <button type="button" data-testid="fetch-users" onClick={() => props.onFetchUsers([{ userId: 'user-a', nickname: 'Alice' }])}>fetch</button>
    <button type="button" data-testid="select-user" onClick={() => props.onUserItemClick({ userId: 'user-a', nickname: 'Alice' })}>select</button>
    <button type="button" data-testid="focus-user" onClick={props.onFocusItemChange}>focus</button>
    {props.targetNickname}:{String(props.ableAddMention)}
  </div>
));
jest.mock('../../RemoveMessageModal', () => (props: any) => (
  <div data-testid="remove-modal">
    <button type="button" data-testid="remove-submit" onClick={props.onSubmit}>submit</button>
    <button type="button" data-testid="remove-cancel" onClick={props.onCancel}>cancel</button>
  </div>
));
jest.mock('../../../../../ui/FileViewer', () => (props: any) => (
  <div data-testid="file-viewer">
    <button type="button" data-testid="download" onClick={(event) => props.onDownloadClick(event)}>download</button>
    <button type="button" data-testid="delete-file" onClick={props.onDelete}>delete</button>
    <button type="button" data-testid="close-file" onClick={props.onClose}>close</button>
  </div>
));
jest.mock('../../../../../ui/MobileMenu', () => (props: any) => (
  <div data-testid="mobile-menu">
    <button type="button" data-testid="mobile-edit" onClick={() => props.showEdit(true)}>edit</button>
    <button type="button" data-testid="mobile-remove" onClick={() => props.showRemove(true)}>remove</button>
    <button type="button" data-testid="mobile-download" onClick={(event) => props.onDownloadClick(event)}>download</button>
    <button type="button" data-testid="mobile-hide" onClick={props.hideMenu}>hide</button>
    {props.deleteMenuState}:{String(props.isByMe)}
  </div>
));

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};
const parentMessage = {
  messageId: 30,
  createdAt: 3000,
  message: 'parent message',
  sender: {
    userId: 'me',
    nickname: 'Me',
    profileUrl: '',
  },
  isUserMessage: () => true,
};
const currentChannel = {
  url: 'channel-url',
  myRole: 'operator',
  members: [
    { userId: 'me', nickname: 'Member Me', profileUrl: 'member.png' },
  ],
  startTyping: jest.fn(),
  endTyping: jest.fn(),
};
const actions = {
  toggleReaction: jest.fn(),
  updateMessage: jest.fn(),
  deleteMessage: jest.fn().mockResolvedValue(undefined),
};

const setup = ({ isMobile = false, threadMessages = [], profileContext = {}, downloadHandler }: any = {}) => {
  jest.clearAllMocks();
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
      DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
    },
  });
  (useMediaQueryContext as jest.Mock).mockReturnValue({ isMobile });
  (useUserProfileContext as jest.Mock).mockReturnValue({
    disableUserProfile: false,
    renderUserProfile: undefined,
    ...profileContext,
  });
  (useDirtyGetMentions as jest.Mock).mockReturnValue([]);
  (useThread as jest.Mock).mockReturnValue({
    state: {
      currentChannel,
      parentMessage,
      allThreadMessages: threadMessages,
      emojiContainer: { emojiCategories: [] },
      onMoveToParentMessage: jest.fn(),
      onHeaderActionClick: jest.fn(),
      isMuted: false,
      isChannelFrozen: false,
      onBeforeDownloadFileMessage: downloadHandler ?? jest.fn().mockResolvedValue(false),
      filterEmojiCategoryIds: jest.fn(),
    },
    actions,
  });
};

describe('ParentMessageInfo', () => {
  beforeEach(() => {
    setup();
  });

  it('renders profile, desktop menus, reactions, remove modal, file viewer, and edit flow', async () => {
    const downloadHandler = jest.fn()
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error('decision failed'));
    setup({ downloadHandler });
    const renderMessageMenu = jest.fn((props) => (
      <div data-testid="message-menu">
        <button type="button" data-testid="menu-edit" onClick={() => props.showEdit(true)}>edit</button>
        <button type="button" data-testid="menu-remove" onClick={() => props.showRemove(true)}>remove</button>
        <button type="button" data-testid="move-parent" onClick={props.onMoveToParentMessage}>move</button>
        {String(props.disableDeleteMessage)}
      </div>
    ));
    const renderEmojiMenu = jest.fn((props) => (
      <button type="button" data-testid="emoji-menu" onClick={() => props.toggleReaction(props.message, 'smile', false)}>
        emoji
      </button>
    ));

    render(
      <ParentMessageInfo
        className="custom-parent"
        renderMessageMenu={renderMessageMenu}
        renderEmojiMenu={renderEmojiMenu}
      />,
    );

    expect(screen.getByText('Member Me')).toBeInTheDocument();
    expect(screen.getByText('parent-date')).toBeInTheDocument();
    expect(screen.getByTestId('connected-profile')).toHaveTextContent('me');
    expect(renderMessageMenu).toHaveBeenCalledWith(expect.objectContaining({
      disableDeleteMessage: false,
      isByMe: true,
    }));

    fireEvent.click(screen.getByTestId('move-parent'));
    fireEvent.click(screen.getByTestId('emoji-menu'));
    expect(actions.toggleReaction).toHaveBeenCalledWith(parentMessage, 'smile', false);

    fireEvent.click(screen.getByTestId('menu-remove'));
    fireEvent.click(screen.getByTestId('remove-submit'));
    expect((useThread as jest.Mock).mock.results.at(-1).value.state.onHeaderActionClick).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('parent-item'));
    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith('ParentMessageInfo: Not allowed to download.');
    });
    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'ParentMessageInfo: Error occurred while determining download continuation:',
        expect.any(Error),
      );
    });
    fireEvent.click(screen.getByTestId('delete-file'));
    await waitFor(() => {
      expect(actions.deleteMessage).toHaveBeenCalledWith(parentMessage);
    });

    fireEvent.click(screen.getByTestId('menu-edit'));
    fireEvent.click(screen.getByTestId('start-typing'));
    expect(currentChannel.startTyping).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('mention-change'));
    expect(screen.getByTestId('mention-list')).toHaveTextContent('@al:true');
    fireEvent.click(screen.getByTestId('fetch-users'));
    fireEvent.click(screen.getByTestId('fetch-key'));
    fireEvent.click(screen.getByTestId('select-user'));
    fireEvent.click(screen.getByTestId('user-mentioned'));
    fireEvent.click(screen.getByTestId('mentioned-ids'));
    fireEvent.click(screen.getByTestId('update'));

    expect(actions.updateMessage).toHaveBeenCalledWith({
      messageId: 30,
      message: 'edited',
      mentionedUsers: [{ userId: 'user-a', nickname: 'Alice' }],
      mentionTemplate: '@al edited',
    });
    expect(currentChannel.endTyping).toHaveBeenCalled();
  });

  it('renders custom user profile, cancels edit, and hides delete menu for existing replies', () => {
    setup({
      threadMessages: [{ messageId: 1 }],
      profileContext: {
        renderUserProfile: ({ user }: any) => <div data-testid="custom-profile">{user.userId}</div>,
      },
    });
    render(
      <ParentMessageInfo
        renderEmojiMenu={() => <div data-testid="emoji-menu-disabled" />}
        renderMessageMenu={(props) => (
          <div data-testid="message-menu">
            <button type="button" data-testid="menu-edit" onClick={() => props.showEdit(true)}>edit</button>
            {String(props.disableDeleteMessage)}
          </div>
        )}
      />,
    );

    expect(screen.getByTestId('custom-profile')).toHaveTextContent('me');
    expect(screen.getByTestId('message-menu')).toHaveTextContent('true');
    fireEvent.click(screen.getByTestId('menu-edit'));
    fireEvent.click(screen.getByTestId('mention-change'));
    fireEvent.click(screen.getByTestId('cancel'));
    expect(screen.queryByTestId('edit-input')).toBeNull();
    expect(currentChannel.endTyping).toHaveBeenCalled();
  });

  it('opens and closes mobile long-press menu', () => {
    setup({ isMobile: true });
    const { container } = render(<ParentMessageInfo renderEmojiMenu={() => <div data-testid="emoji-menu-disabled" />} />);

    fireEvent.mouseDown(container.querySelector('.sendbird-parent-message-info') as Element);
    expect(screen.getByTestId('mobile-menu')).toHaveTextContent('ACTIVE:true');

    fireEvent.click(screen.getByTestId('mobile-edit'));
    expect(screen.getByTestId('edit-input')).toBeInTheDocument();
  });
});
