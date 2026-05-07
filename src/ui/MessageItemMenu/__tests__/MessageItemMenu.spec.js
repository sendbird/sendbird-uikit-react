import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

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

describe('ui/MessageItemMenu', () => {
  const openLatestMenu = () => {
    const triggers = document.getElementsByClassName('sendbird-message-item-menu__trigger');
    fireEvent.click(triggers[triggers.length - 1]);
  };

  const clickMenuItem = (testId) => {
    const item = document.querySelector(`[data-testid="${testId}"]`);
    expect(item).toBeTruthy();
    fireEvent.click(item);
  };

  it('should have components by own basic status', () => {
    const className="class-name-for-test";
    const { container } = render(
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
      container.getElementsByClassName('sendbird-dropdown-portal')[0].id
    ).toBe('sendbird-dropdown-portal');
    expect(
      container.getElementsByClassName('sendbird-message-item-menu').length
    ).toBe(1);
    expect(
      container.querySelector(`.${className}.sendbird-message-item-menu`)
    ).toBeTruthy();
    expect(
      container.getElementsByClassName('sendbird-message-item-menu__trigger').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-message-item-menu__trigger__icon').length
    ).toBe(1);
  });

  // TODO: Add tests with onClick events
  it('invokes visible menu item actions', () => {
    document.queryCommandSupported = jest.fn(() => true);
    document.execCommand = jest.fn(() => true);
    const showEdit = jest.fn();
    const showRemove = jest.fn();
    const setQuoteMessage = jest.fn();
    const onReplyInThread = jest.fn();
    const onMoveToParentMessage = jest.fn();
    const setSupposedHover = jest.fn();
    const message = createMockMessage();

    render(
      <div>
        <MenuRoot />
        <MessageItemMenu
          message={message}
          channel={createMockChannel((channel) => ({
            ...channel,
            isEphemeral: false,
            isBroadcast: false,
          }))}
          isByMe
          replyType="QUOTE_REPLY"
          showEdit={showEdit}
          showRemove={showRemove}
          setQuoteMessage={setQuoteMessage}
          onReplyInThread={onReplyInThread}
          onMoveToParentMessage={onMoveToParentMessage}
          setSupposedHover={setSupposedHover}
        />
      </div>,
    );

    openLatestMenu();
    expect(setSupposedHover).toHaveBeenCalledWith(true);

    clickMenuItem('ui_message_item_menu_copy');
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_reply');
    expect(setQuoteMessage).toHaveBeenCalledWith(message);

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_open_in_channel');
    expect(onMoveToParentMessage).toHaveBeenCalledTimes(1);

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_edit');
    expect(showEdit).toHaveBeenCalledWith(true);

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_delete');
    expect(showRemove).toHaveBeenCalledWith(true);
  });

  it('invokes thread action', () => {
    const onReplyInThread = jest.fn();
    const showRemove = jest.fn();

    render(
      <div>
        <MenuRoot />
        <MessageItemMenu
          message={createMockMessage()}
          channel={createMockChannel((channel) => ({
            ...channel,
            isEphemeral: false,
            isBroadcast: false,
          }))}
          isByMe
          replyType="THREAD"
          onReplyInThread={onReplyInThread}
          showRemove={showRemove}
        />
      </div>,
    );

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_thread');
    expect(onReplyInThread).toHaveBeenCalledWith({ message: expect.objectContaining({ messageId: 1010 }) });
  });

  it('invokes failed resend and delete actions', () => {
    const resendMessage = jest.fn();
    const deleteMessage = jest.fn();

    render(
      <div>
        <MenuRoot />
        <MessageItemMenu
          message={createMockMessage((message) => ({
            ...message,
            sendingStatus: 'failed',
            isResendable: true,
          }))}
          channel={createMockChannel()}
          isByMe
          resendMessage={resendMessage}
          deleteMessage={deleteMessage}
        />
      </div>,
    );

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_resend');
    expect(resendMessage).toHaveBeenCalledTimes(1);

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_delete');
    expect(deleteMessage).toHaveBeenCalledTimes(1);
  });

  it('does not invoke disabled edit and delete actions', () => {
    const showEdit = jest.fn();
    const showRemove = jest.fn();

    render(
      <div>
        <MenuRoot />
        <MessageItemMenu
          message={createMockMessage()}
          channel={createMockChannel((channel) => ({ ...channel, isEphemeral: false }))}
          isByMe
          disabled
          showEdit={showEdit}
          showRemove={showRemove}
        />
      </div>,
    );

    openLatestMenu();
    clickMenuItem('ui_message_item_menu_edit');
    clickMenuItem('ui_message_item_menu_delete');
    expect(showEdit).not.toHaveBeenCalled();
    expect(showRemove).not.toHaveBeenCalled();
  });

  it('should do a snapshot test of the MessageItemMenu DOM', function() {
    const { asFragment } = render(
      <MessageItemMenu
        className="classname-for-snapshot"
        message={createMockMessage()}
        channel={createMockChannel()}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
