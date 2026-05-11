import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Role } from '@sendbird/chat';

import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import useChannelSettings from '../../../context/useChannelSettings';
import { InviteUsersModal } from '../InviteUsersModal';
import { MemberList } from '../MemberList';
import { MembersModal } from '../MembersModal';
import AddOperatorsModal from '../AddOperatorsModal';
import { BannedUserList } from '../BannedUserList';
import { BannedUsersModal } from '../BannedUsersModal';
import { MutedMemberList } from '../MutedMemberList';
import { MutedMembersModal } from '../MutedMembersModal';
import { OperatorList } from '../OperatorList';
import { OperatorsModal } from '../OperatorsModal';

jest.mock('../../../../../ui/Modal', () => (props: any) => {
  const React = require('react');
  return React.createElement('section', {}, [
    React.createElement('h1', { key: 'title' }, props.titleText),
    React.createElement('div', { key: 'body' }, props.children),
    !props.hideFooter && React.createElement('button', {
      key: 'submit',
      type: 'button',
      disabled: props.disabled,
      onClick: props.onSubmit,
    }, props.submitText || 'submit'),
    React.createElement('button', {
      key: 'cancel',
      type: 'button',
      onClick: props.onCancel || props.onClose,
    }, 'cancel'),
  ]);
});

jest.mock('../../../../../ui/UserListItem', () => (props: any) => {
  const React = require('react');
  const menu = props.renderListItemMenu?.({ user: props.user, channel: props.channel });
  return React.createElement('div', {}, [
    React.createElement('button', {
      key: 'user',
      type: 'button',
      disabled: props.disabled,
      'data-testid': `user-${props.user.userId}`,
      onClick: () => props.onChange?.({ target: { id: props.user.userId, checked: !props.checked } }),
    }, `${props.user.nickname || props.user.userId}${props.checked ? ':checked' : ''}`),
    menu && React.createElement(React.Fragment, { key: 'menu' }, menu),
  ]);
});

jest.mock('../../../../../ui/UserListItemMenu', () => ({
  UserListItemMenu: (props: any) => {
    const React = require('react');
    return React.createElement('div', {}, [
      React.createElement('button', {
        key: 'operator',
        type: 'button',
        'data-testid': `operator-${props.user.userId}`,
        onClick: () => props.onToggleOperatorState?.({ user: props.user, newStatus: true }),
      }, 'operator'),
      React.createElement('button', {
        key: 'mute',
        type: 'button',
        'data-testid': `mute-${props.user.userId}`,
        onClick: () => props.onToggleMuteState?.({ user: props.user, newStatus: true }),
      }, 'mute'),
      React.createElement('button', {
        key: 'ban',
        type: 'button',
        'data-testid': `ban-${props.user.userId}`,
        onClick: () => props.onToggleBanState?.({ user: props.user, newStatus: true }),
      }, 'ban'),
    ]);
  },
}));

jest.mock('../../../../../ui/UserListItemMenu/UserListItemMenu', () => ({
  __esModule: true,
  default: (props: any) => {
    const React = require('react');
    return React.createElement('button', {
      type: 'button',
      'data-testid': `operator-${props.user.userId}`,
      onClick: () => props.onToggleOperatorState?.({ user: props.user, newStatus: false }),
    }, 'operator');
  },
}));

jest.mock('../../../../../hooks/useOnScrollReachedEndDetector', () => ({
  useOnScrollPositionChangeDetector: (handlers: any) => () => handlers.onReachedBottom?.(),
}));

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../context/useChannelSettings', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const stringSet = {
  BUTTON__INVITE: 'Invite',
  CHANNEL_SETTING__MEMBERS__SELECT_TITLE: 'Select members',
  CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS: 'See all members',
  CHANNEL_SETTING__MEMBERS__INVITE_MEMBER: 'Invite member',
  CHANNEL_SETTING__OPERATORS__ADD_BUTTON: 'Add operators',
  CHANNEL_SETTING__OPERATORS__TITLE_ADD: 'Add operator',
  CHANNEL_SETTING__OPERATORS__TITLE_ALL: 'All operators',
  CHANNEL_SETTING__BANNED_MEMBERS__TITLE: 'Banned users',
  CHANNEL_SETTING__MODERATION__ALL_BAN: 'All banned users',
  CHANNEL_SETTING__MODERATION__EMPTY_BAN: 'No banned users',
  CHANNEL_SETTING__MUTED_MEMBERS__TITLE: 'Muted members',
  CHANNEL_SETTING__MUTED_MEMBERS__TITLE_ALL: 'All muted members',
  CHANNEL_SETTING__NO_UNMUTED: 'No muted members',
  MODAL__INVITE_MEMBER__SELECTED: 'selected',
};

const member = (userId: string, overrides = {}) => ({
  userId,
  nickname: userId,
  role: Role.NONE,
  isMuted: false,
  ...overrides,
});

const renderWithLocale = (ui: React.ReactElement) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    {ui}
  </LocalizationContext.Provider>
);

const setupChannelSettings = (channelOverrides = {}) => {
  const firstPage = [member('member-a')];
  const query = {
    hasNext: true,
    next: jest.fn()
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce([member('member-b')])
      .mockResolvedValue([]),
  };
  const operatorQuery = {
    hasNext: true,
    next: jest.fn()
      .mockResolvedValueOnce([member('operator-a')])
      .mockResolvedValueOnce([member('operator-b')])
      .mockResolvedValue([]),
  };
  const bannedQuery = {
    hasNext: true,
    next: jest.fn()
      .mockResolvedValueOnce([member('banned-a')])
      .mockResolvedValueOnce([member('banned-b')])
      .mockResolvedValue([]),
  };
  const channel = {
    url: 'channel-url',
    myRole: Role.OPERATOR,
    members: [member('member-a')],
    isSuper: false,
    isBroadcast: false,
    inviteWithUserIds: jest.fn().mockResolvedValue(undefined),
    addOperators: jest.fn().mockResolvedValue(undefined),
    createMemberListQuery: jest.fn(() => query),
    createOperatorListQuery: jest.fn(() => operatorQuery),
    createBannedUserListQuery: jest.fn(() => bannedQuery),
    ...channelOverrides,
  };
  const forceUpdateUI = jest.fn();
  (useChannelSettings as jest.Mock).mockReturnValue({
    state: {
      channel,
      forceUpdateUI,
      queries: {
        applicationUserListQuery: { limit: 20 },
      },
    },
  });
  return { channel, forceUpdateUI, query, operatorQuery, bannedQuery };
};

describe('ChannelSettings moderation member and invite components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const appUsersQuery = {
      hasNext: false,
      next: jest.fn().mockResolvedValue([
        member('member-a'),
        member('user-b'),
      ]),
    };
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        stores: {
          sdkStore: {
            sdk: {
              currentUser: member('current-user'),
              createApplicationUserListQuery: jest.fn(() => appUsersQuery),
            },
          },
        },
        config: {
          userListQuery: null,
        },
      },
    });
    setupChannelSettings();
  });

  it('selects non-members and invites them through the channel by default', async () => {
    const onSubmit = jest.fn();
    renderWithLocale(<InviteUsersModal onCancel={jest.fn()} onSubmit={onSubmit} />);

    expect(await screen.findByTestId('user-member-a')).toBeDisabled();
    const user = await screen.findByTestId('user-user-b');
    fireEvent.click(user);
    fireEvent.click(screen.getByText('Invite'));

    const { state: { channel } } = (useChannelSettings as jest.Mock).mock.results[0].value;
    await waitFor(() => {
      expect(channel.inviteWithUserIds).toHaveBeenCalledWith(['user-b']);
      expect(onSubmit).toHaveBeenCalledWith(['user-b']);
    });
  });

  it('uses overrideInviteUser when provided', async () => {
    const overrideInviteUser = jest.fn();
    const { channel } = setupChannelSettings();
    (useChannelSettings as jest.Mock).mockReturnValue({
      state: {
        channel,
        overrideInviteUser,
        queries: {},
      },
    });
    const onCancel = jest.fn();
    renderWithLocale(<InviteUsersModal onCancel={onCancel} onSubmit={jest.fn()} />);

    fireEvent.click(await screen.findByTestId('user-user-b'));
    fireEvent.click(screen.getByText('Invite'));

    expect(overrideInviteUser).toHaveBeenCalledWith(expect.objectContaining({
      users: ['user-b'],
      onClose: onCancel,
    }));
  });

  it('catches rejected invite user queries without crashing', async () => {
    const appUsersQuery = {
      hasNext: false,
      next: jest.fn().mockRejectedValue(new Error('query failed')),
    };
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        stores: {
          sdkStore: {
            sdk: {
              currentUser: member('current-user'),
              createApplicationUserListQuery: jest.fn(() => appUsersQuery),
            },
          },
        },
        config: {
          userListQuery: null,
        },
      },
    });

    renderWithLocale(<InviteUsersModal onCancel={jest.fn()} onSubmit={jest.fn()} />);

    await waitFor(() => {
      expect(appUsersQuery.next).toHaveBeenCalled();
    });
    expect(screen.getByText('Invite')).toBeInTheDocument();
  });

  it('renders member list actions and updates local member state', async () => {
    setupChannelSettings();
    renderWithLocale(<MemberList />);

    expect(await screen.findByTestId('user-member-a')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('operator-member-a'));
    fireEvent.click(screen.getByTestId('mute-member-a'));
    fireEvent.click(screen.getByTestId('ban-member-a'));

    expect(screen.queryByTestId('user-member-a')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('See all members'));
    expect(screen.getAllByText('See all members').length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByText('cancel').at(-1) as HTMLElement);
    await waitFor(() => expect(screen.queryByText('cancel')).not.toBeInTheDocument());
  });

  it('loads more members in the members modal on scroll', async () => {
    renderWithLocale(<MembersModal onCancel={jest.fn()} />);

    expect(await screen.findByTestId('user-member-a')).toBeInTheDocument();
    fireEvent.scroll(document.querySelector('.sendbird-more-members__popup-scroll') as Element);

    expect(await screen.findByTestId('user-member-b')).toBeInTheDocument();
  });

  it('adds selected operators and lists existing operators with pagination', async () => {
    const { channel } = setupChannelSettings();
    const onSubmit = jest.fn();
    renderWithLocale(<AddOperatorsModal onCancel={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.click(await screen.findByTestId('user-member-a'));
    fireEvent.click(screen.getByText('Add operators'));

    await waitFor(() => {
      expect(channel.addOperators).toHaveBeenCalledWith(['member-a']);
      expect(onSubmit).toHaveBeenCalledWith(['member-a']);
    });

    renderWithLocale(<OperatorsModal onCancel={jest.fn()} />);
    expect(await screen.findByTestId('user-operator-a')).toBeInTheDocument();
    fireEvent.scroll(Array.from(document.querySelectorAll('.sendbird-more-members__popup-scroll')).at(-1) as Element);
    expect(await screen.findByTestId('user-operator-b')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('operator-operator-a'));
    expect(screen.queryByTestId('user-operator-a')).not.toBeInTheDocument();
  });

  it('opens operator, banned, and muted list modals from their compact lists', async () => {
    jest.useFakeTimers();
    setupChannelSettings();

    const { unmount } = renderWithLocale(<OperatorList />);
    expect(await screen.findByTestId('user-operator-a')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('operator-operator-a'));
    act(() => {
      jest.runOnlyPendingTimers();
    });
    unmount();

    renderWithLocale(<BannedUserList />);
    expect(await screen.findByTestId('user-banned-a')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('All banned users'));
      await Promise.resolve();
    });
    expect(screen.getAllByText('All banned users').length).toBeGreaterThan(0);

    jest.useRealTimers();
  });

  it('loads and removes banned and muted users in their modals', async () => {
    await act(async () => {
      renderWithLocale(<BannedUsersModal onCancel={jest.fn()} />);
      await Promise.resolve();
    });
    expect(await screen.findByTestId('user-banned-a')).toBeInTheDocument();
    fireEvent.scroll(document.querySelector('.sendbird-more-members__popup-scroll') as Element);
    expect(await screen.findByTestId('user-banned-b')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('ban-banned-a'));
    expect(screen.queryByTestId('user-banned-a')).not.toBeInTheDocument();

    renderWithLocale(<MutedMembersModal onCancel={jest.fn()} />);
    expect(await screen.findByTestId('user-member-a')).toBeInTheDocument();
    fireEvent.scroll(document.querySelectorAll('.sendbird-more-members__popup-scroll')[1] as Element);
    expect(await screen.findByTestId('user-member-b')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('mute-member-a'));
    expect(screen.queryByTestId('user-member-a')).not.toBeInTheDocument();
  });

  it('shows empty states for banned and muted compact lists', async () => {
    const emptyQuery = { hasNext: false, next: jest.fn().mockResolvedValue([]) };
    setupChannelSettings({
      createBannedUserListQuery: jest.fn(() => emptyQuery),
      createMemberListQuery: jest.fn(() => emptyQuery),
    });

    const { unmount } = renderWithLocale(<BannedUserList />);
    expect(await screen.findByText('No banned users')).toBeInTheDocument();
    unmount();

    renderWithLocale(<MutedMemberList />);
    expect(await screen.findByText('No muted members')).toBeInTheDocument();
  });
});
