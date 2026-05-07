import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { DesktopLayout } from '../DesktopLayout';
import { MobileLayout } from '../MobileLayout';

const mockPause = jest.fn();
const mockAddGroupChannelHandler = jest.fn();
const mockRemoveGroupChannelHandler = jest.fn();
const mockGroupChannelHandler = jest.fn((handlers) => handlers);

jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelHandler: function GroupChannelHandler(handlers: any) {
    return mockGroupChannelHandler(handlers);
  },
}));

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          sdk: {
            groupChannel: {
              addGroupChannelHandler: mockAddGroupChannelHandler,
              removeGroupChannelHandler: mockRemoveGroupChannelHandler,
            },
          },
        },
      },
      config: { userId: 'current-user' },
    },
  })),
}));

jest.mock('../../../hooks/VoicePlayer', () => ({
  ALL: 'ALL',
  useVoicePlayerContext: () => ({ pause: mockPause }),
}));

jest.mock('../../GroupChannelList', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onChannelSelect, onChannelCreated }: any) => (
      <div data-testid="group-channel-list">
        <button type="button" onClick={() => onChannelSelect?.({ url: 'selected-channel' })}>select group channel</button>
        <button type="button" onClick={() => onChannelCreated?.({ url: 'created-channel' })}>create group channel</button>
      </div>
    ),
  };
});

jest.mock('../../ChannelList', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onChannelSelect }: any) => (
      <button type="button" data-testid="legacy-channel-list" onClick={() => onChannelSelect?.(null)}>
        select legacy channel
      </button>
    ),
  };
});

const message = { messageId: 7, createdAt: 7000 };
const parentMessage = { messageId: 9, createdAt: 9000 };

jest.mock('../../GroupChannel', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="group-channel">
        <span>{props.channelUrl}</span>
        <button type="button" onClick={props.onChatHeaderActionClick}>open channel settings</button>
        <button type="button" onClick={props.onSearchClick}>open search</button>
        <button type="button" onClick={() => props.onReplyInThread?.({ message })}>reply thread</button>
        <button type="button" onClick={() => props.onReplyInThreadClick?.({ message })}>reply thread click</button>
        <button type="button" onClick={() => props.onQuoteMessageClick?.({ message })}>quote thread</button>
        <button type="button" onClick={props.onBackClick}>back to list</button>
        <button type="button" onClick={props.onMessageAnimated}>animated</button>
      </div>
    ),
  };
});

jest.mock('../../Channel', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="legacy-channel">
        <span>{props.channelUrl}</span>
        <button type="button" onClick={props.onChatHeaderActionClick}>legacy settings</button>
      </div>
    ),
  };
});

jest.mock('../../ChannelSettings', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ channelUrl, onCloseClick, onLeaveChannel }: any) => (
      <div data-testid="channel-settings">
        <span>{channelUrl}</span>
        <button type="button" onClick={onCloseClick}>close channel settings</button>
        <button type="button" onClick={onLeaveChannel}>leave channel</button>
      </div>
    ),
  };
});

jest.mock('../../MessageSearch', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onResultClick, onCloseClick }: any) => (
      <div data-testid="message-search">
        <button type="button" onClick={() => onResultClick?.(message)}>search result</button>
        <button type="button" onClick={onCloseClick}>close search</button>
      </div>
    ),
  };
});

jest.mock('../../Thread', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onHeaderActionClick, onMoveToParentMessage }: any) => (
      <div data-testid="thread">
        <button type="button" onClick={onHeaderActionClick}>close thread</button>
        <button type="button" onClick={() => onMoveToParentMessage?.({ message: parentMessage, channel: { url: 'parent-channel' } })}>
          move parent
        </button>
      </div>
    ),
  };
});

const createProps = (overrides = {}) => ({
  isReactionEnabled: true,
  replyType: 'THREAD',
  isMessageGroupingEnabled: true,
  isMultipleFilesMessageEnabled: true,
  autoscrollMessageOverflowToTop: false,
  allowProfileEdit: true,
  showSearchIcon: true,
  onProfileEditSuccess: jest.fn(),
  disableAutoSelect: false,
  currentChannel: { url: 'current-channel' },
  setCurrentChannel: jest.fn(),
  showSettings: false,
  setShowSettings: jest.fn(),
  showSearch: false,
  setShowSearch: jest.fn(),
  highlightedMessage: null,
  setHighlightedMessage: jest.fn(),
  startingPoint: null,
  setStartingPoint: jest.fn(),
  showThread: false,
  setShowThread: jest.fn(),
  threadTargetMessage: null,
  setThreadTargetMessage: jest.fn(),
  enableLegacyChannelModules: false,
  ...overrides,
});

describe('App layouts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('wires desktop channel list, channel actions, settings, search, thread, and legacy modules', () => {
    const props = createProps();
    const { rerender } = render(<DesktopLayout {...props as any} />);

    fireEvent.click(screen.getByText('select group channel'));
    expect(props.setStartingPoint).toHaveBeenCalledWith(null);
    expect(props.setHighlightedMessage).toHaveBeenCalledWith(null);
    expect(props.setCurrentChannel).toHaveBeenCalledWith({ url: 'selected-channel' });

    fireEvent.click(screen.getByText('open channel settings'));
    expect(props.setShowSearch).toHaveBeenCalledWith(false);
    expect(props.setShowThread).toHaveBeenCalledWith(false);
    expect(props.setShowSettings).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByText('open search'));
    expect(props.setShowSettings).toHaveBeenCalledWith(false);
    expect(props.setShowSearch).toHaveBeenCalledWith(expect.any(Function));

    fireEvent.click(screen.getByText('reply thread'));
    expect(props.setThreadTargetMessage).toHaveBeenCalledWith(message);
    expect(props.setShowThread).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByText('quote thread'));
    expect(props.setThreadTargetMessage).toHaveBeenCalledWith(message);

    rerender(<DesktopLayout {...createProps({ showSettings: true }) as any} />);
    fireEvent.click(screen.getByText('close channel settings'));
    expect(screen.getByTestId('channel-settings')).toBeInTheDocument();

    const searchProps = createProps({ showSearch: true, highlightedMessage: 7 });
    rerender(<DesktopLayout {...searchProps as any} />);
    fireEvent.click(screen.getByText('search result'));
    expect(searchProps.setHighlightedMessage).toHaveBeenCalledWith(null);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(searchProps.setHighlightedMessage).toHaveBeenCalledWith(7);

    const threadProps = createProps({ showThread: true, highlightedMessage: 1 });
    rerender(<DesktopLayout {...threadProps as any} />);
    fireEvent.click(screen.getByText('move parent'));
    expect(threadProps.setCurrentChannel).toHaveBeenCalledWith({ url: 'parent-channel' });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(threadProps.setHighlightedMessage).toHaveBeenCalledWith(parentMessage.messageId);

    rerender(<DesktopLayout {...createProps({ enableLegacyChannelModules: true }) as any} />);
    expect(screen.getByTestId('legacy-channel-list')).toBeInTheDocument();
    expect(screen.getByTestId('legacy-channel')).toBeInTheDocument();
  });

  it('switches mobile panels and reacts to channel lifecycle handlers', () => {
    const props = createProps();
    const { unmount } = render(<MobileLayout {...props as any} />);

    expect(mockAddGroupChannelHandler).toHaveBeenCalledTimes(1);
    const handler = mockAddGroupChannelHandler.mock.calls[0][1];

    fireEvent.click(screen.getByText('select group channel'));
    expect(props.setCurrentChannel).toHaveBeenCalledWith({ url: 'selected-channel' });
    expect(screen.getByTestId('group-channel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('open channel settings'));
    expect(screen.getByTestId('channel-settings')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close channel settings'));
    expect(screen.getByTestId('group-channel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('open search'));
    expect(screen.getByTestId('message-search')).toBeInTheDocument();
    fireEvent.click(screen.getByText('search result'));
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(props.setHighlightedMessage).toHaveBeenCalledWith(message.messageId);

    fireEvent.click(screen.getByText('reply thread click'));
    expect(props.setThreadTargetMessage).toHaveBeenCalledWith(message);
    expect(screen.getByTestId('thread')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close thread'));
    expect(mockPause).toHaveBeenCalledWith('ALL');

    fireEvent.click(screen.getByText('back to list'));
    expect(mockPause).toHaveBeenCalledWith('ALL');

    act(() => {
      handler.onUserBanned({ url: 'current-channel' }, { userId: 'current-user' });
      handler.onUserLeft({ url: 'current-channel' }, { userId: 'current-user' });
      handler.onChannelDeleted('current-channel');
    });

    unmount();
    expect(mockRemoveGroupChannelHandler).toHaveBeenCalled();
  });
});
