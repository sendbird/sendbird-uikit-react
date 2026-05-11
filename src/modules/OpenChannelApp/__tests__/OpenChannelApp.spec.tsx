import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import OpenChannelApp from '../index';
import Community from '../Community';
import Streaming from '../Streaming';
import CommunityChannelList from '../components/CommunityChannelList';
import DummyStream from '../components/DummyStream';
import Login from '../components/Login';
import OpenChannelPreview from '../components/OpenChannelPreview';
import Profile from '../components/Profile';
import StreamingChannelList from '../components/StreamingChannelList';
import { LocalizationContext } from '../../../lib/LocalizationContext';

const mockChannels = [
  {
    url: 'open-channel-1',
    name: 'General',
    coverUrl: 'cover-1',
    data: JSON.stringify({
      name: 'Live event',
      creator_info: { name: 'Ada', id: 'ada', profile_url: 'ada.png' },
      tags: ['chat', 'live'],
      thumbnail_url: 'thumb.png',
      live_channel_url: 'live.png',
    }),
    participantCount: 1200,
    isFrozen: true,
  },
  {
    url: 'open-channel-2',
    name: 'Random',
    coverUrl: 'cover-2',
    data: '{invalid',
    participantCount: 2,
    isFrozen: false,
  },
];
const mockQuery = {
  hasNext: true,
  next: jest.fn().mockResolvedValue(mockChannels),
};
const mockCreateChannel = jest.fn().mockResolvedValue({ url: 'created-open-channel', name: 'Created' });
const mockSdk = {
  openChannel: {
    createOpenChannelListQuery: jest.fn(() => mockQuery),
    createChannel: mockCreateChannel,
  },
};
const mockUser = { userId: 'current-user', nickname: 'Current User', profileUrl: '' };

jest.mock('../../../lib/Sendbird', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: any) => <div data-testid="sendbird-provider">{children}</div>,
    withSendBird: (Component: any) => (props: any) => <Component {...props} sdk={mockSdk} user={mockUser} />,
  };
});

jest.mock('../../OpenChannel', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ channelUrl, onChatHeaderActionClick, renderHeader }: any) => (
      <div data-testid="open-channel">
        <span>{channelUrl}</span>
        {renderHeader?.()}
        <button type="button" onClick={onChatHeaderActionClick}>open settings</button>
      </div>
    ),
  };
});

jest.mock('../../OpenChannelSettings', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ channelUrl, onCloseClick, onDeleteChannel }: any) => (
      <div data-testid="open-channel-settings">
        <span>{channelUrl}</span>
        <button type="button" onClick={onCloseClick}>close settings</button>
        <button type="button" onClick={() => onDeleteChannel?.({ url: channelUrl })}>delete channel</button>
      </div>
    ),
  };
});

jest.mock('../../OpenChannelList', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onChannelSelected }: any) => (
      <button type="button" onClick={() => onChannelSelected({ url: 'selected-open-channel' })}>
        select open channel
      </button>
    ),
  };
});

jest.mock('../../../ui/Modal', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, titleText, submitText = 'submit', onCancel, onSubmit }: any) => (
      <div role="dialog" aria-label={titleText}>
        <div>{children}</div>
        <button type="button" onClick={onSubmit}>{submitText}</button>
        <button type="button" onClick={onCancel}>cancel</button>
      </div>
    ),
  };
});

jest.mock('../../../ui/Avatar', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ src, alt, customDefaultComponent }: any) => (
      <div data-testid="avatar">{src ? <img src={src} alt={alt} /> : customDefaultComponent?.({})}</div>
    ),
  };
});

jest.mock('../../../ui/Label', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, className }: any) => <span className={className}>{children}</span>,
    LabelColors: new Proxy({}, { get: (_target, key) => key }),
    LabelTypography: new Proxy({}, { get: (_target, key) => key }),
  };
});

jest.mock('../../../ui/IconButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClick, className }: any) => (
      <button type="button" className={className} onClick={onClick}>{children}</button>
    ),
  };
});

jest.mock('../../../ui/Icon', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ type }: any) => <span data-testid="icon">{type}</span>,
    IconColors: new Proxy({}, { get: (_target, key) => key }),
    IconTypes: new Proxy({}, { get: (_target, key) => key }),
  };
});

jest.mock('../../../ui/TextButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, onClick, className }: any) => (
      <button type="button" className={className} onClick={onClick}>{children}</button>
    ),
  };
});

jest.mock('../../../ui/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => <button type="button" onClick={onClick}>{children}</button>,
  ButtonTypes: new Proxy({}, { get: (_target, key) => key }),
  ButtonSizes: new Proxy({}, { get: (_target, key) => key }),
}));

const stringSet = {
  CREATE_OPEN_CHANNEL_LIST__SUBMIT: 'Create channel',
};

const renderWithLocalization = (ui: React.ReactElement) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    {ui}
  </LocalizationContext.Provider>,
);

describe('OpenChannelApp examples', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    mockQuery.hasNext = true;
    mockQuery.next.mockResolvedValue(mockChannels);
    mockSdk.openChannel.createOpenChannelListQuery.mockReturnValue(mockQuery);
    mockCreateChannel.mockResolvedValue({ url: 'created-open-channel', name: 'Created' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('selects channels and toggles settings in the legacy open channel app', () => {
    render(<OpenChannelApp appId="app" userId="user" nickname="nick" channelUrl="initial-open-channel" />);

    expect(screen.getByText('initial-open-channel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('select open channel'));
    expect(screen.getByText('selected-open-channel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('open settings'));
    expect(screen.getByTestId('open-channel-settings')).toBeInTheDocument();
    fireEvent.click(screen.getByText('delete channel'));
    expect(screen.queryByTestId('open-channel-settings')).not.toBeInTheDocument();
  });

  it('selects a channel and opens settings in the community layout', () => {
    render(<Community appId="app" userId="user" nickname="nick" theme="dark" />);

    fireEvent.click(screen.getByText('select open channel'));
    expect(screen.getByText('selected-open-channel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('open settings'));
    expect(screen.getByTestId('open-channel-settings')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close settings'));
    expect(screen.queryByTestId('open-channel-settings')).not.toBeInTheDocument();
  });

  it('uses the streaming header to collapse, expand, and open settings', async () => {
    const { container } = render(<Streaming appId="app" userId="user" nickname="nick" />);

    await waitFor(() => {
      expect(screen.getByText('open-channel-1')).toBeInTheDocument();
    });

    fireEvent.click(container.querySelector('.collapse') as Element);
    expect(container.querySelector('.expand-icon')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.expand-icon') as Element);
    expect(screen.getByText('Live Chat')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.close') as Element);
    expect(screen.getByTestId('open-channel-settings')).toBeInTheDocument();
  });

  it('renders community and streaming channel lists with injected Sendbird state', async () => {
    const setCurrentChannel = jest.fn();
    const setChannels = jest.fn();

    renderWithLocalization(
      <CommunityChannelList
        currentChannelUrl="open-channel-2"
        setCurrentChannel={setCurrentChannel}
        channels={mockChannels as any}
        setChannels={setChannels}
      /> as any,
    );

    await waitFor(() => {
      expect(setChannels).toHaveBeenCalledWith(mockChannels);
      expect(setCurrentChannel).toHaveBeenCalledWith(mockChannels[0]);
    });
    fireEvent.click(screen.getAllByText('General')[0]);
    expect(setCurrentChannel).toHaveBeenCalledWith(mockChannels[0]);

    fireEvent.click(document.querySelector('.community-channel-list__header__create-channel') as Element);
    fireEvent.change(screen.getByPlaceholderText('Enter channel name'), { target: { value: 'Created channel' } });
    fireEvent.click(screen.getByText('Create channel'));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Created channel',
        customType: 'SB_COMMUNITY_TYPE',
        operatorUserIds: ['current-user'],
      }));
    });

    render(<StreamingChannelList currentChannelUrl="open-channel-1" setCurrentChannel={setCurrentChannel} /> as any);
    await waitFor(() => {
      expect(screen.getByText('Live streaming')).toBeInTheDocument();
    });
  });

  it('renders previews, streams, login, and profile states', () => {
    const onPreviewClick = jest.fn();
    const setValues = jest.fn();

    render(
      <>
        <OpenChannelPreview channel={mockChannels[0] as any} selected onClick={onPreviewClick} isStreaming />
        <OpenChannelPreview channel={mockChannels[1] as any} selected={false} onClick={onPreviewClick} isStreaming />
        <DummyStream currentChannel={mockChannels[0] as any} />
        <DummyStream currentChannel={mockChannels[1] as any} />
        <Login setValues={setValues} />
        <Profile user={{ userId: 'with-image', nickname: 'Image User', profileUrl: 'profile.png' } as any} />
        <Profile user={{ userId: 'no-image', nickname: 'No Image', profileUrl: '' } as any} />
      </>,
    );

    fireEvent.click(screen.getAllByText('General')[0]);
    expect(onPreviewClick).toHaveBeenCalled();
    expect(screen.getByText('1.20 k')).toBeInTheDocument();
    expect(screen.getByText('No information')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('userId'), { target: { value: 'login-user' } });
    fireEvent.change(screen.getByPlaceholderText('nickname'), { target: { value: 'Login Nick' } });
    fireEvent.click(document.getElementById('darkTheme') as Element);
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(setValues).toHaveBeenCalledWith({
      userId: 'login-user',
      nickName: 'Login Nick',
      darkTheme: true,
    });
    expect(screen.getByText('Image User')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('updates streaming preview metadata when channel data changes', () => {
    const onPreviewClick = jest.fn();
    const { rerender } = render(
      <OpenChannelPreview channel={mockChannels[0] as any} selected={false} onClick={onPreviewClick} isStreaming />,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();

    rerender(
      <OpenChannelPreview
        channel={{
          ...mockChannels[0],
          data: JSON.stringify({
            name: 'Live event',
            creator_info: { name: 'Grace', id: 'grace', profile_url: 'grace.png' },
          }),
        } as any}
        selected={false}
        onClick={onPreviewClick}
        isStreaming
      />,
    );

    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
  });
});
