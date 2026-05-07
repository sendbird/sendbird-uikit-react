import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Role } from '@sendbird/chat';

import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { MenuRoot } from '../../ContextMenu';
import { UserListItemMenu } from '../UserListItemMenu';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedUseSendbird = useSendbird as jest.Mock;

const targetUser = {
  userId: 'target-user',
  nickname: 'Target user',
};

const createChannel = (overrides = {}) => ({
  url: 'channel-url',
  myRole: Role.OPERATOR,
  isBroadcast: false,
  addOperators: jest.fn().mockResolvedValue(undefined),
  removeOperators: jest.fn().mockResolvedValue(undefined),
  muteUser: jest.fn().mockResolvedValue(undefined),
  unmuteUser: jest.fn().mockResolvedValue(undefined),
  banUser: jest.fn().mockResolvedValue(undefined),
  unbanUser: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

const renderMenu = (props = {}) => {
  const {
    channel = createChannel(),
    ...rest
  } = props as { channel?: ReturnType<typeof createChannel> } & Record<string, unknown>;
  const view = render(
    <div className="sendbird-user-list-item">
      <MenuRoot />
      <UserListItemMenu
        user={targetUser as any}
        channel={channel as any}
        {...rest}
      />
    </div>,
  );
  const openMenu = () => {
    fireEvent.click(view.container.querySelector('.sendbird-user-message__more__menu') as HTMLElement);
  };
  return { ...view, channel, openMenu };
};

describe('UserListItemMenu', () => {
  beforeEach(() => {
    mockedUseSendbird.mockReturnValue({
      state: {
        config: {
          userId: 'current-user',
        },
      },
    });
  });

  it('does not render a menu for the current user', () => {
    mockedUseSendbird.mockReturnValue({
      state: {
        config: {
          userId: 'target-user',
        },
      },
    });

    const { container } = render(
      <UserListItemMenu
        user={targetUser as any}
        channel={createChannel() as any}
      />,
    );

    expect(container.querySelector('.sendbird-user-list-item-menu')).toBeNull();
  });

  it('renders default menu items and invokes channel actions', async () => {
    const channel = createChannel();
    const onToggleOperatorState = jest.fn();
    const onToggleMuteState = jest.fn();
    const onToggleBanState = jest.fn();
    const { openMenu } = renderMenu({
      channel,
      onToggleOperatorState,
      onToggleMuteState,
      onToggleBanState,
    });

    openMenu();
    fireEvent.click(screen.getByText('Register as operator'));
    await waitFor(() => {
      expect(channel.addOperators).toHaveBeenCalledWith(['target-user']);
    });
    expect(onToggleOperatorState).toHaveBeenCalledWith({ user: targetUser, newStatus: true });

    openMenu();
    fireEvent.click(screen.getByText('Mute'));
    await waitFor(() => {
      expect(channel.muteUser).toHaveBeenCalledWith(targetUser);
    });
    expect(onToggleMuteState).toHaveBeenCalledWith({ user: targetUser, newStatus: true });

    openMenu();
    fireEvent.click(screen.getByText('Ban'));
    await waitFor(() => {
      expect(channel.banUser).toHaveBeenCalledWith(targetUser);
    });
    expect(onToggleBanState).toHaveBeenCalledWith({ user: targetUser, newStatus: true });
  });

  it('renders inverse labels for already moderated users', () => {
    const { openMenu } = renderMenu({
      isOperator: true,
      isMuted: true,
      isBanned: true,
    });

    openMenu();

    expect(screen.getByText('Unregister operator')).toBeTruthy();
    expect(screen.getByText('Unmute')).toBeTruthy();
    expect(screen.getByText('Unban')).toBeTruthy();
  });

  it('hides mute for broadcast channels and hides all items for non-operators', () => {
    const broadcastChannel = createChannel({ isBroadcast: true });
    const broadcastView = renderMenu({ channel: broadcastChannel });

    broadcastView.openMenu();
    expect(screen.getByText('Register as operator')).toBeTruthy();
    expect(screen.queryByText('Mute')).toBeNull();
    expect(screen.getByText('Ban')).toBeTruthy();

    broadcastView.unmount();
    const memberChannel = createChannel({ myRole: Role.NONE });
    const memberView = renderMenu({ channel: memberChannel });

    memberView.openMenu();
    expect(screen.queryByText('Register as operator')).toBeNull();
    expect(screen.queryByText('Mute')).toBeNull();
    expect(screen.queryByText('Ban')).toBeNull();
  });

  it('supports custom trigger and menu item renderers', async () => {
    const channel = createChannel();
    const onClick = jest.fn();
    const { container } = renderMenu({
      channel,
      className: 'custom-menu',
      renderTrigger: ({ toggleMenu }) => (
        <button type="button" data-testid="custom-trigger" onClick={toggleMenu}>
          trigger
        </button>
      ),
      renderMenuItems: ({ items }) => (
        <items.OperatorToggleMenuItem onClick={onClick}>
          Toggle operator
        </items.OperatorToggleMenuItem>
      ),
    });

    expect(container.querySelector('.custom-menu')).toBeTruthy();

    fireEvent.click(screen.getByTestId('custom-trigger'));
    fireEvent.click(screen.getByText('Toggle operator'));

    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(channel.addOperators).toHaveBeenCalledWith(['target-user']);
    });
  });
});
