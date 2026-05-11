import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import MobileBottomSheet from '../MobileBottomSheet';
import MobileContextMenu from '../MobileContextMenu';
import { MobileEmojisBottomSheet } from '../MobileEmojisBottomSheet';
import { ReactedMembersBottomSheet } from '../ReactedMembersBottomSheet';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../BottomSheet', () => (props: any) => (
  <div data-testid="bottom-sheet" onClick={props.onBackdropClick}>{props.children}</div>
));
jest.mock('../../ContextMenu', () => ({
  MenuItems: (props: any) => <div data-testid="mobile-context-menu">{props.children}</div>,
}));
jest.mock('../../ReactionButton', () => (props: any) => (
  <button
    type="button"
    data-testid={props.testID}
    data-selected={String(props.selected)}
    onClick={props.onClick}
  >
    {props.children}
  </button>
));
jest.mock('../../ImageRenderer', () => (props: any) => <img alt="emoji" src={props.url} />);
jest.mock('../../UserListItem', () => (props: any) => (
  <button type="button" data-testid={`user-${props.user.userId}`} onClick={props.onUserAvatarClick}>
    {props.user.userId}
  </button>
));
jest.mock('../../MessageMenu/menuItems/BottomSheetMenuItems', () => ({
  CopyMenuItem: () => <button type="button" data-testid="bottom-copy">copy</button>,
  EditMenuItem: () => <button type="button" data-testid="bottom-edit">edit</button>,
  ResendMenuItem: () => <button type="button" data-testid="bottom-resend">resend</button>,
  ReplyMenuItem: () => <button type="button" data-testid="bottom-reply">reply</button>,
  ThreadMenuItem: () => <button type="button" data-testid="bottom-thread">thread</button>,
  DeleteMenuItem: () => <button type="button" data-testid="bottom-delete">delete</button>,
  DownloadMenuItem: () => <button type="button" data-testid="bottom-download">download</button>,
  MarkAsUnreadMenuItem: () => <button type="button" data-testid="bottom-unread">unread</button>,
}));
jest.mock('../../MessageMenu/menuItems/MobileMenuItems', () => ({
  CopyMenuItem: () => <button type="button" data-testid="context-copy">copy</button>,
  ReplyMenuItem: () => <button type="button" data-testid="context-reply">reply</button>,
  ThreadMenuItem: () => <button type="button" data-testid="context-thread">thread</button>,
  EditMenuItem: () => <button type="button" data-testid="context-edit">edit</button>,
  ResendMenuItem: () => <button type="button" data-testid="context-resend">resend</button>,
  DeleteMenuItem: () => <button type="button" data-testid="context-delete">delete</button>,
  DownloadMenuItem: () => <button type="button" data-testid="context-download">download</button>,
  MarkAsUnreadMenuItem: () => <button type="button" data-testid="context-unread">unread</button>,
}));

const emojiContainer = {
  emojiCategories: [{
    emojis: [
      { key: 'smile', url: 'smile.png' },
      { key: 'heart', url: 'heart.png' },
    ],
  }],
};

const message = {
  messageId: 1,
  sender: { userId: 'sender' },
  reactions: [
    { key: 'smile', userIds: ['me', 'alice'] },
    { key: 'heart', userIds: ['bob'] },
  ],
};

describe('MobileMenu sheets', () => {
  beforeEach(() => {
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          isOnline: true,
          groupChannel: {
            enableMarkAsUnread: true,
          },
        },
      },
    });
  });

  it('renders emoji reactions and toggles the selected state', () => {
    const hideMenu = jest.fn();
    const toggleReaction = jest.fn();

    render(
      <MobileEmojisBottomSheet
        userId="me"
        message={message as any}
        emojiContainer={emojiContainer as any}
        hideMenu={hideMenu}
        toggleReaction={toggleReaction}
      />,
    );

    expect(screen.getByTestId('ui_mobile_emoji_reactions_menu_smile')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('ui_mobile_emoji_reactions_menu_heart')).toHaveAttribute('data-selected', 'false');

    fireEvent.click(screen.getByTestId('ui_mobile_emoji_reactions_menu_smile'));

    expect(toggleReaction).toHaveBeenCalledWith(message, 'smile', true);
    expect(hideMenu).toHaveBeenCalledTimes(1);
  });

  it('renders reacted members for the selected emoji and opens user profiles', () => {
    const hideMenu = jest.fn();
    const onPressUserProfileHandler = jest.fn();
    const channel = {
      members: [
        { userId: 'alice' },
        { userId: 'bob' },
      ],
    };

    render(
      <ReactedMembersBottomSheet
        message={message as any}
        channel={channel as any}
        emojiKey="smile"
        hideMenu={hideMenu}
        emojiContainer={emojiContainer as any}
        onPressUserProfileHandler={onPressUserProfileHandler}
      />,
    );

    expect(screen.getByTestId('user-alice')).toBeInTheDocument();
    expect(screen.queryByTestId('user-bob')).toBeNull();

    fireEvent.click(screen.getByText('1'));
    expect(screen.getByTestId('user-bob')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('user-bob'));
    expect(onPressUserProfileHandler).toHaveBeenCalledWith(message.sender);
  });

  it('renders bottom-sheet reactions and menu items from message state', () => {
    const hideMenu = jest.fn();
    const toggleReaction = jest.fn();
    const bottomMessage = {
      ...message,
      message: 'hello',
      messageType: 'user',
      sendingStatus: 'succeeded',
      parentMessageId: 0,
      threadInfo: { replyCount: 0 },
      isUserMessage: () => true,
      isFileMessage: () => false,
      isResendable: false,
    };

    render(
      <MobileBottomSheet
        hideMenu={hideMenu}
        channel={{ isGroupChannel: () => true, isBroadcast: false } as any}
        emojiContainer={emojiContainer as any}
        message={bottomMessage as any}
        replyType="THREAD"
        userId="sender"
        isReactionEnabled
        toggleReaction={toggleReaction}
      />,
    );

    expect(screen.getByTestId('ui_mobile_emoji_reactions_menu_smile')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-copy')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-edit')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-thread')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-delete')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('ui_mobile_emoji_reactions_menu_smile'));
    expect(toggleReaction).toHaveBeenCalledWith(bottomMessage, 'smile', false);
    expect(hideMenu).toHaveBeenCalled();
  });

  it('renders context menu defaults and custom renderMenuItems', () => {
    const baseProps = {
      hideMenu: jest.fn(),
      parentRef: { current: document.createElement('div') },
      channel: { isGroupChannel: () => true, isSuper: false, isBroadcast: false },
      message: {
        ...message,
        message: 'hello',
        messageType: 'user',
        sendingStatus: 'succeeded',
        parentMessageId: 0,
        threadInfo: { replyCount: 0 },
        isUserMessage: () => true,
        isFileMessage: () => false,
        isResendable: false,
      },
      replyType: 'QUOTE_REPLY',
      userId: 'sender',
    };
    const { rerender } = render(<MobileContextMenu {...(baseProps as any)} />);

    expect(screen.getByTestId('context-copy')).toBeInTheDocument();
    expect(screen.getByTestId('context-reply')).toBeInTheDocument();
    expect(screen.getByTestId('context-edit')).toBeInTheDocument();
    expect(screen.getByTestId('context-delete')).toBeInTheDocument();
    expect(screen.getByTestId('context-unread')).toBeInTheDocument();

    rerender(
      <MobileContextMenu
        {...(baseProps as any)}
        renderMenuItems={({ items }) => <items.CopyMenuItem />}
      />,
    );

    expect(screen.getByTestId('context-copy')).toBeInTheDocument();
  });

  it('does not render empty mobile menus when no default actions are available', () => {
    const voiceReplyMessage = {
      messageId: 2,
      sender: { userId: 'sender' },
      messageType: 'file',
      sendingStatus: 'succeeded',
      parentMessageId: 1,
      parentMessage: { messageId: 1 },
      threadInfo: { replyCount: 0 },
      type: 'audio/m4a;sbu_type=voice',
      isUserMessage: () => false,
      isFileMessage: () => true,
      isResendable: false,
    };
    const channel = {
      isGroupChannel: () => true,
      isSuper: true,
      isBroadcast: true,
    };

    render(
      <MobileContextMenu
        hideMenu={jest.fn()}
        parentRef={{ current: document.createElement('div') }}
        channel={channel as any}
        message={voiceReplyMessage as any}
        replyType="THREAD"
        userId="other-user"
        isOpenedFromThread
      />,
    );

    expect(screen.queryByTestId('mobile-context-menu')).toBeNull();

    render(
      <MobileBottomSheet
        hideMenu={jest.fn()}
        channel={channel as any}
        message={voiceReplyMessage as any}
        replyType="THREAD"
        userId="other-user"
        isOpenedFromThread
      />,
    );

    expect(screen.queryByTestId('bottom-sheet')).toBeNull();
  });
});
