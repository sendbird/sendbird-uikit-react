import React from 'react';
import { render, screen } from '@testing-library/react';

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
      screen.getByTestId('sendbird-dropdown-portal').id
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
