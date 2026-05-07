import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import EditDetailsModal from '../EditDetailsModal';
import OpenChannelProfile from '../OpenChannelProfile';
import { OperatorUI, copyToClipboard } from '../OperatorUI';
import AddOperatorsModal from '../OperatorUI/AddOperatorsModal';
import BannedUserList from '../OperatorUI/BannedUserList';
import BannedUsersModal from '../OperatorUI/BannedUsersModal';
import DeleteOpenChannel from '../OperatorUI/DeleteOpenChannel';
import MutedParticipantList from '../OperatorUI/MutedParticipantList';
import MutedParticipantsModal from '../OperatorUI/MutedParticipantsModal';
import OperatorList from '../OperatorUI/OperatorList';
import OperatorsModal from '../OperatorUI/OperatorsModal';
import ParticipantList from '../ParticipantUI';
import ParticipantsAccordion, { UserListItem } from '../ParticipantUI/ParticipantItem';
import ParticipantsModal from '../ParticipantUI/ParticipantsModal';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

const mockUseOpenChannelSettingsContext = useOpenChannelSettingsContext as jest.Mock;
const mockUseSendbird = useSendbird as jest.Mock;

jest.mock('@sendbird/chat', () => ({
  Participant: class Participant {
    constructor(props: Record<string, unknown>) {
      Object.assign(this, props);
    }
  },
}));

jest.mock('../../context/OpenChannelSettingsProvider', () => ({
  useOpenChannelSettingsContext: jest.fn(),
}));

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../lib/UserProfileContext', () => ({
  useUserProfileContext: jest.fn(() => ({
    disableUserProfile: false,
    renderUserProfile: null,
  })),
}));

jest.mock('../../../../ui/Modal', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, titleText, submitText = 'submit', onCancel, onClose, onSubmit }: any) => React.createElement(
      'div',
      { role: 'dialog', 'aria-label': titleText },
      children,
      React.createElement('button', { type: 'button', onClick: onSubmit }, submitText),
      React.createElement('button', { type: 'button', onClick: onCancel || onClose }, 'cancel modal'),
    ),
  };
});

jest.mock('../../../../ui/Accordion', () => {
  const React = require('react');
  const Accordion = ({ renderTitle, renderContent, id }: any) => React.createElement(
    'section',
    { 'data-testid': `accordion-${id}` },
    React.createElement('div', null, renderTitle?.()),
    React.createElement('div', null, renderContent?.()),
  );
  return {
    __esModule: true,
    default: Accordion,
    AccordionGroup: ({ children }: any) => React.createElement('div', { 'data-testid': 'accordion-group' }, children),
  };
});

jest.mock('../../../../ui/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClick, className, disabled }: any) => React.createElement(
      'button',
      { type: 'button', className, disabled, onClick },
      children,
    ),
    ButtonTypes: new Proxy({}, { get: (_target, key) => key }),
    ButtonSizes: new Proxy({}, { get: (_target, key) => key }),
  };
});

jest.mock('../../../../ui/Label', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, className }: any) => React.createElement('span', { className }, children),
    LabelColors: new Proxy({}, { get: (_target, key) => key }),
    LabelTypography: new Proxy({}, { get: (_target, key) => key }),
  };
});

jest.mock('../../../../ui/Icon', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ type, onClick, className }: any) => onClick
      ? React.createElement(
        'button',
        { type: 'button', 'aria-label': `icon-${String(type)}`, className, onClick },
        String(type),
      )
      : React.createElement('span', { 'aria-label': `icon-${String(type)}`, className }, String(type)),
    IconColors: new Proxy({}, { get: (_target, key) => key }),
    IconTypes: new Proxy({}, { get: (_target, key) => key }),
  };
});

jest.mock('../../../../ui/IconButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClick, className }: any) => React.createElement(
      'button',
      { type: 'button', className, onClick },
      children,
    ),
  };
});

jest.mock('../../../../ui/ContextMenu', () => {
  const React = require('react');
  const closeDropdown = jest.fn();
  return {
    __esModule: true,
    default: ({ menuTrigger, menuItems }: any) => React.createElement(
      'div',
      null,
      menuTrigger?.(jest.fn()),
      menuItems?.(closeDropdown),
    ),
    MenuItems: ({ children }: any) => React.createElement('div', null, children),
    MenuItem: ({ children, onClick, testID }: any) => React.createElement(
      'button',
      { type: 'button', 'data-testid': testID, onClick },
      children,
    ),
    MuteMenuItem: ({ children, onChange, onError, testID }: any) => React.createElement('button', {
      type: 'button',
      'data-testid': testID,
      onClick: () => {
        try {
          onChange?.();
        } catch (error) {
          onError?.(error);
        }
      },
    }, children),
    OperatorMenuItem: ({ children, onChange, onError, testID }: any) => React.createElement('button', {
      type: 'button',
      'data-testid': testID,
      onClick: () => {
        try {
          onChange?.();
        } catch (error) {
          onError?.(error);
        }
      },
    }, children),
  };
});

jest.mock('../../../../ui/UserListItem', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ user, checkBox, checked, disabled, onChange, action }: any) => React.createElement(
      'div',
      { 'data-testid': `ui-user-${user.userId}` },
      React.createElement('span', null, user.nickname || user.userId),
      checkBox ? React.createElement('input', {
        'aria-label': `check-${user.userId}`,
        id: user.userId,
        type: 'checkbox',
        checked,
        disabled,
        onChange,
      }) : null,
      action?.({ actionRef: { current: null }, parentRef: { current: null } }),
    ),
  };
});

jest.mock('../../../../ui/Avatar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ src, onClick }: any) => React.createElement('button', {
      type: 'button',
      'data-testid': 'avatar',
      onClick,
    }, src || 'avatar'),
  };
});
jest.mock('../../../../ui/Avatar/index', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ src, onClick }: any) => React.createElement('button', {
      type: 'button',
      'data-testid': 'avatar',
      onClick,
    }, src || 'avatar'),
  };
});

jest.mock('../../../../ui/Avatar/MutedAvatarOverlay', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('span', { 'data-testid': 'muted-overlay' }, 'muted'),
  };
});

jest.mock('../../../../ui/UserProfile', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ user }: any) => React.createElement('div', { 'data-testid': `profile-${user.userId}` }, 'profile'),
  };
});

jest.mock('../../../../ui/TextButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClick, className }: any) => React.createElement(
      'button',
      { type: 'button', className, onClick },
      children,
    ),
  };
});

jest.mock('../../../../ui/Input', () => {
  const React = require('react');
  const Input = React.forwardRef(({ value, placeHolder, required, name }: any, ref: any) => React.createElement('input', {
    ref,
    required,
    name,
    defaultValue: value,
    placeholder: placeHolder,
  }));
  return {
    __esModule: true,
    default: Input,
    InputLabel: ({ children }: any) => React.createElement('label', null, children),
  };
});

jest.mock('../../../../ui/ChannelAvatar/OpenChannelAvatar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ channel }: any) => React.createElement('div', { 'data-testid': 'open-channel-avatar' }, channel?.name),
  };
});

const participantA = { userId: 'participant-a', nickname: 'Participant A', profileUrl: 'a.png', isMuted: false };
const participantB = { userId: 'participant-b', nickname: '', profileUrl: '', isMuted: true };
const operatorA = { userId: 'operator-a', nickname: 'Operator A', profileUrl: 'oa.png', isMuted: false };
const operatorB = { userId: 'operator-b', nickname: 'Operator B', profileUrl: 'ob.png', isMuted: true };
const currentUser = { userId: 'current-user', nickname: 'Current User', profileUrl: '' };
const mutedUser = { userId: 'muted-user', nickname: 'Muted User', profileUrl: '' };
const bannedUser = { userId: 'banned-user', nickname: 'Banned User', profileUrl: '' };

const createQuery = (items: any[], hasNext = true) => ({
  hasNext,
  next: jest.fn().mockResolvedValue(items),
});

const createChannel = (overrides = {}) => ({
  url: 'open-channel-url',
  name: 'Open Channel',
  data: 'channel-data',
  operators: [
    operatorA,
    operatorB,
    ...Array.from({ length: 10 }, (_value, index) => ({
      userId: `operator-extra-${index}`,
      nickname: `Operator Extra ${index}`,
      profileUrl: '',
    })),
  ],
  isOperator: jest.fn((userId) => String(userId).startsWith('operator') || userId === 'current-user'),
  createParticipantListQuery: jest.fn(() => createQuery([participantA, participantB])),
  createOperatorListQuery: jest.fn(() => createQuery([operatorA, operatorB])),
  createMutedUserListQuery: jest.fn(() => createQuery([mutedUser])),
  createBannedUserListQuery: jest.fn(() => createQuery([bannedUser])),
  addOperators: jest.fn().mockResolvedValue(undefined),
  removeOperators: jest.fn().mockResolvedValue(undefined),
  banUser: jest.fn().mockResolvedValue(undefined),
  unbanUser: jest.fn().mockResolvedValue(undefined),
  muteUser: jest.fn().mockResolvedValue(undefined),
  unmuteUser: jest.fn().mockResolvedValue(undefined),
  updateChannel: jest.fn().mockResolvedValue({ url: 'open-channel-url', name: 'Updated Open Channel' }),
  delete: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const pubSub = { publish: jest.fn() };

const stringSet = new Proxy({
  NO_NAME: 'No name',
  CHANNEL_SETTING__HEADER__TITLE: 'Open channel settings',
  OPEN_CHANNEL_SETTINGS__OPERATOR_URL: 'Open channel URL',
  OPEN_CHANNEL_SETTINGS__OPERATORS_TITLE: 'Operators',
  OPEN_CHANNEL_SETTINGS__PARTICIPANTS_ACCORDION_TITLE: 'Participants',
  OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE: 'Muted members',
  OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE: 'Banned members',
  OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ADD: 'Add operators',
  OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ALL: 'All operators',
  OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE: 'All participants',
  OPEN_CHANNEL_SETTINGS__SEE_ALL: 'See all',
  OPEN_CHANNEL_SETTINGS__EMPTY_LIST: 'No users',
  OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__NO_ONE: 'No muted users',
  OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__NO_ONE: 'No banned users',
  OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE_ALL: 'All muted members',
  OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE_ALL: 'All banned members',
  OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR: 'Unregister operator',
  OPEN_CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR: 'Register operator',
  OPEN_CHANNEL_SETTING__MODERATION__UNMUTE: 'Unmute',
  OPEN_CHANNEL_SETTING__MODERATION__MUTE: 'Mute',
  OPEN_CHANNEL_SETTING__MODERATION__BAN: 'Ban',
  OPEN_CHANNEL_SETTING__MODERATION__UNBAN: 'Unban',
  OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_PANEL: 'Delete channel',
  OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE: 'Delete open channel',
  OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT: 'Delete',
  OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_CONTEXT: 'Delete this channel?',
  OPEN_CHANNEL_SETTINGS__NO_TITLE: 'No title',
  OPEN_CHANNEL_SETTINGS__MEMBERS__YOU: ' (You)',
  OPEN_CHANNEL_SETTINGS__MEMBERS__OPERATOR: 'Operator',
  CHANNEL_SETTING__PROFILE__EDIT: 'Edit',
  MODAL__CHANNEL_INFORMATION__TITLE: 'Channel information',
  MODAL__CHANNEL_INFORMATION__CHANNEL_IMAGE: 'Channel image',
  MODAL__CHANNEL_INFORMATION__UPLOAD: 'Upload',
  MODAL__CHANNEL_INFORMATION__CHANNEL_NAME: 'Channel name',
  MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER: 'Enter channel name',
  BUTTON__SAVE: 'Save',
  BUTTON__CANCEL: 'Cancel',
  CHANNEL_SETTING__OPERATORS__ADD_BUTTON: 'Add',
  OPEN_CHANNEL_CONVERSATION__SELECT_PARTICIPANTS: 'Select participants',
  MODAL__INVITE_MEMBER__SELECTED: 'selected',
}, {
  get(target, key: string) {
    return key in target ? target[key] : key;
  },
});

const renderWithProviders = (ui: React.ReactElement) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    {ui}
  </LocalizationContext.Provider>,
);

describe('OpenChannelSettings components', () => {
  let channel: ReturnType<typeof createChannel>;
  let onCloseClick: jest.Mock;
  let onDeleteChannel: jest.Mock;
  let onChannelModified: jest.Mock;
  let onBeforeUpdateChannel: jest.Mock;
  let setChannel: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    channel = createChannel();
    onCloseClick = jest.fn();
    onDeleteChannel = jest.fn();
    onChannelModified = jest.fn();
    onBeforeUpdateChannel = jest.fn((name, coverUrlOrImage, data) => ({ name, coverUrlOrImage, data }));
    setChannel = jest.fn();
    mockUseOpenChannelSettingsContext.mockReturnValue({
      channelUrl: channel.url,
      channel,
      isChannelInitialized: true,
      onCloseClick,
      onDeleteChannel,
      onChannelModified,
      onBeforeUpdateChannel,
      setChannel,
    });
    mockUseSendbird.mockReturnValue({
      state: {
        config: {
          userId: currentUser.userId,
          isOnline: true,
          theme: 'light',
          logger,
          pubSub,
        },
      },
    });
    Object.defineProperty(window, 'URL', {
      value: { createObjectURL: jest.fn(() => 'blob:image') },
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('copies channel URLs and renders the operator shell', () => {
    (window as any).clipboardData = { setData: jest.fn(() => true) };
    expect(copyToClipboard('legacy-copy')).toBe(true);
    expect((window as any).clipboardData.setData).toHaveBeenCalledWith('Text', 'legacy-copy');
    delete (window as any).clipboardData;

    document.queryCommandSupported = jest.fn(() => true);
    document.execCommand = jest.fn(() => true);
    expect(copyToClipboard('modern-copy')).toBe(true);
    (document.execCommand as jest.Mock).mockImplementation(() => {
      throw new Error('copy failed');
    });
    expect(copyToClipboard('failed-copy')).toBe(false);
    document.queryCommandSupported = jest.fn(() => false);
    expect(copyToClipboard('unsupported-copy')).toBe(false);

    renderWithProviders(<OperatorUI renderChannelProfile={() => <div>custom profile</div>} />);

    expect(screen.getByText('Open channel settings')).toBeInTheDocument();
    expect(screen.getByText('custom profile')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('icon-CLOSE'));
    expect(onCloseClick).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('icon-COPY'));
    expect(document.queryCommandSupported).toHaveBeenCalledWith('copy');
  });

  it('manages operator list modals and operator actions', async () => {
    renderWithProviders(<OperatorList />);

    expect(screen.getByText('Operator A')).toBeInTheDocument();
    fireEvent.click(screen.getAllByTestId('open_channel_setting_operator_context_menu_unregister_operator')[0]);
    await waitFor(() => {
      expect(channel.removeOperators).toHaveBeenCalledWith(['operator-a']);
    });

    fireEvent.click(screen.getAllByTestId('open_channel_setting_operator_context_menu_ban')[0]);
    await waitFor(() => {
      expect(channel.banUser).toHaveBeenCalledWith(operatorA);
    });

    fireEvent.click(screen.getByText('Add operators'));
    await waitFor(() => {
      expect(screen.getByText('Participant A')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('check-participant-a'));
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => {
      expect(channel.addOperators).toHaveBeenCalledWith(['participant-a']);
    });

    fireEvent.click(screen.getByText('All operators'));
    await waitFor(() => {
      expect(screen.getAllByText('Operator A').length).toBeGreaterThan(0);
    });
  });

  it('adds operators from the modal directly and respects existing operators', async () => {
    const onSubmit = jest.fn();
    renderWithProviders(<AddOperatorsModal onCancel={jest.fn()} onSubmit={onSubmit} />);

    await waitFor(() => {
      expect(screen.getByText('Participant A')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('check-participant-a'));
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(channel.addOperators).toHaveBeenCalledWith(['participant-a']);
      expect(onSubmit).toHaveBeenCalledWith(['participant-a']);
    });
  });

  it('renders muted and banned lists, modals, and empty states', async () => {
    const emptyChannel = createChannel({
      createMutedUserListQuery: jest.fn(() => createQuery([], false)),
      createBannedUserListQuery: jest.fn(() => createQuery([], false)),
    });
    mockUseOpenChannelSettingsContext.mockReturnValueOnce({ channel: emptyChannel });
    renderWithProviders(<MutedParticipantList />);
    await waitFor(() => {
      expect(screen.getByText('No muted users')).toBeInTheDocument();
    });

    mockUseOpenChannelSettingsContext.mockReturnValueOnce({ channel: emptyChannel });
    renderWithProviders(<BannedUserList />);
    await waitFor(() => {
      expect(screen.getByText('No banned users')).toBeInTheDocument();
    });

    mockUseOpenChannelSettingsContext.mockReturnValue({ channel });
    renderWithProviders(<MutedParticipantList />);
    await waitFor(() => {
      expect(screen.getByText('Muted User')).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByTestId('open_channel_setting_muted_member_context_menu_unmute')[0]);
    await waitFor(() => {
      expect(channel.unmuteUser).toHaveBeenCalledWith(mutedUser);
    });
    fireEvent.click(screen.getAllByText('All muted members')[0]);
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Muted members' })).toBeInTheDocument();
    });

    renderWithProviders(<BannedUserList />);
    await waitFor(() => {
      expect(screen.getByText('Banned User')).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByTestId('open_channel_setting_banned_user_context_menu_unban')[0]);
    await waitFor(() => {
      expect(channel.unbanUser).toHaveBeenCalledWith(bannedUser);
    });
    fireEvent.click(screen.getAllByText('All banned members')[0]);
    await waitFor(() => {
      expect(screen.getAllByRole('dialog', { name: 'Muted members' }).length).toBeGreaterThan(0);
    });
  });

  it('renders operator, muted, banned, and participant modals directly', async () => {
    renderWithProviders(
      <>
        <OperatorsModal onCancel={jest.fn()} />
        <MutedParticipantsModal onCancel={jest.fn()} />
        <BannedUsersModal onCancel={jest.fn()} />
        <ParticipantsModal onCancel={jest.fn()} />
      </>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('Operator A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Muted User').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Banned User').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Participant A').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByTestId('open_channel_setting_operator_context_menu_unregister_operator')[0]);
    fireEvent.click(screen.getAllByTestId('open_channel_setting_muted_member_context_menu_unmute')[0]);
    fireEvent.click(screen.getAllByTestId('open_channel_setting_banned_user_context_menu_unban')[0]);
    fireEvent.click(screen.getAllByTestId('open_channel_setting_participant_context_menu_ban')[0]);

    await waitFor(() => {
      expect(channel.removeOperators).toHaveBeenCalled();
      expect(channel.unmuteUser).toHaveBeenCalled();
      expect(channel.unbanUser).toHaveBeenCalled();
      expect(channel.banUser).toHaveBeenCalled();
    });
  });

  it('renders participant list, accordion, and list item states', async () => {
    renderWithProviders(<ParticipantList isOperatorView />);

    await waitFor(() => {
      expect(screen.getByText('Participant A')).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByTestId('open_channel_setting_partitipant_conext_menu_ban')[0]);
    await waitFor(() => {
      expect(channel.banUser).toHaveBeenCalledWith(participantA);
    });
    fireEvent.click(screen.getByText('All participants'));
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'All participants' })).toBeInTheDocument();
    });

    renderWithProviders(<ParticipantsAccordion maxMembers={1} />);
    await waitFor(() => {
      expect(screen.getAllByText('Participant A').length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByText('See all'));
    expect(screen.getAllByRole('dialog', { name: 'All participants' }).length).toBeGreaterThan(0);

    const { Participant } = require('@sendbird/chat');
    renderWithProviders(
      <UserListItem
        user={new Participant({ ...participantB, isMuted: true })}
        currentUser="participant-b"
        isOperator
        action={() => <button type="button">custom action</button>}
      />,
    );
    expect(screen.getByText('No name')).toBeInTheDocument();
    expect(screen.getAllByText('participant-b').length).toBeGreaterThan(0);
    expect(screen.getByTestId('muted-overlay')).toBeInTheDocument();
    expect(screen.getByText('custom action')).toBeInTheDocument();
  });

  it('updates profile details and deletes open channels', async () => {
    renderWithProviders(<OpenChannelProfile />);
    expect(screen.getAllByText('Open Channel').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByRole('dialog', { name: 'Channel information' })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Enter channel name'), { target: { value: 'Updated name' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(channel.updateChannel).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated name',
        data: 'channel-data',
      }));
      expect(onBeforeUpdateChannel).toHaveBeenCalledWith('Updated name', null, 'channel-data');
      expect(onChannelModified).toHaveBeenCalled();
      expect(setChannel).toHaveBeenCalled();
      expect(pubSub.publish).toHaveBeenCalled();
    });

    const failingChannel = createChannel({
      updateChannel: jest.fn().mockRejectedValue(new Error('update failed')),
    });
    mockUseOpenChannelSettingsContext.mockReturnValue({
      channel: failingChannel,
      onBeforeUpdateChannel: undefined,
      onChannelModified,
      setChannel,
    });
    renderWithProviders(<EditDetailsModal onCancel={jest.fn()} />);
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
      expect(setChannel).toHaveBeenCalledWith(null);
    });

    mockUseOpenChannelSettingsContext.mockReturnValue({ channel, onDeleteChannel });
    renderWithProviders(<DeleteOpenChannel />);
    fireEvent.click(screen.getByText('Delete channel'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(channel.delete).toHaveBeenCalledTimes(1);
      expect(onDeleteChannel).toHaveBeenCalledWith(channel);
    });
  });
});
