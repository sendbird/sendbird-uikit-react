import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ChannelListUI from '..';
import { useChannelListContext } from '../../../context/ChannelListProvider';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import * as channelListActions from '../../../dux/actionTypes';

jest.mock('../../../context/ChannelListProvider', () => ({
  useChannelListContext: jest.fn(),
}));
jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../ChannelPreviewAction', () => (props: any) => <button type="button" data-testid="action">{props.channel?.url}</button>);
jest.mock('../../ChannelPreview', () => (props: any) => (
  <button
    type="button"
    data-testid={`default-preview-${props.channel.url}`}
    onClick={props.onClick}
  >
    {props.channel.url}
    {props.isSelected ? ' selected' : ''}
    {props.isTyping ? ' typing' : ''}
  </button>
));
jest.mock('../../AddChannel', () => () => <button type="button" data-testid="add-channel">add</button>);
jest.mock('../../../../GroupChannelList/components/GroupChannelListUI/GroupChannelListUIView', () => ({
  GroupChannelListUIView: (props: any) => (
    <div>
      <button type="button" data-testid="theme" onClick={() => props.onChangeTheme('dark')}>theme</button>
      <button type="button" data-testid="profile" onClick={() => props.onUserProfileUpdated({ userId: 'me' })}>profile</button>
      <button type="button" data-testid="load-more" onClick={props.onLoadMore}>load</button>
      <div data-testid="initialized">{String(props.initialized)}</div>
      {props.renderHeader?.()}
      {props.renderAddChannel?.()}
      {props.channels.map((item: any, index: number) => props.renderChannel({ item, index }))}
    </div>
  ),
}));

const createChannel = (url: string, overrides = {}) => ({
  url,
  leave: jest.fn().mockResolvedValue('left'),
  ...overrides,
});

describe('ChannelListUI', () => {
  const logger = {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };
  const channelListDispatcher = jest.fn();
  const fetchChannelList = jest.fn();
  const onThemeChange = jest.fn();
  const onProfileEditSuccess = jest.fn();
  const channels = [
    createChannel('channel-a'),
    createChannel('channel-b'),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useChannelListContext as jest.Mock).mockReturnValue({
      onThemeChange,
      allowProfileEdit: true,
      allChannels: channels,
      currentChannel: channels[0],
      channelListDispatcher,
      typingChannels: [channels[1]],
      initialized: true,
      fetchChannelList,
      onProfileEditSuccess,
    });
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        stores: {
          sdkStore: {
            sdk: {
              isCacheEnabled: false,
            },
          },
        },
        config: {
          logger,
          isOnline: true,
        },
      },
    });
  });

  it('renders default channel previews and dispatches channel selection', () => {
    render(<ChannelListUI renderHeader={() => <h1>channels</h1>} />);

    expect(screen.getByText('channels')).toBeInTheDocument();
    expect(screen.getByTestId('add-channel')).toBeInTheDocument();
    expect(screen.getByTestId('default-preview-channel-a')).toHaveTextContent('selected');
    expect(screen.getByTestId('default-preview-channel-b')).toHaveTextContent('typing');

    fireEvent.click(screen.getByTestId('default-preview-channel-b'));
    expect(logger.info).toHaveBeenCalledWith('ChannelList: Clicked on channel:', channels[1]);
    expect(channelListDispatcher).toHaveBeenCalledWith({
      type: channelListActions.SET_CURRENT_CHANNEL,
      payload: channels[1],
    });

    fireEvent.click(screen.getByTestId('theme'));
    fireEvent.click(screen.getByTestId('profile'));
    fireEvent.click(screen.getByTestId('load-more'));
    expect(onThemeChange).toHaveBeenCalledWith('dark');
    expect(onProfileEditSuccess).toHaveBeenCalledWith({ userId: 'me' });
    expect(fetchChannelList).toHaveBeenCalledTimes(1);
  });

  it('renders custom previews and handles leave success and failure callbacks', async () => {
    const failedChannel = createChannel('channel-b', {
      leave: jest.fn().mockRejectedValue(new Error('leave failed')),
    });
    (useChannelListContext as jest.Mock).mockReturnValue({
      onThemeChange,
      allChannels: [channels[0], failedChannel],
      currentChannel: null,
      channelListDispatcher,
      typingChannels: [],
      initialized: false,
      fetchChannelList,
    });
    const successCb = jest.fn();
    const failCb = jest.fn();

    render(
      <ChannelListUI
        renderChannelPreview={(props) => (
          <button
            type="button"
            data-testid={`custom-preview-${props.channel.url}`}
            onClick={(event) => {
              event.stopPropagation();
              props.onLeaveChannel(props.channel, props.channel.url === 'channel-a' ? successCb : failCb);
            }}
          >
            {props.channel.url}
          </button>
        )}
      />,
    );

    fireEvent.click(screen.getByTestId('custom-preview-channel-a'));
    await waitFor(() => {
      expect(successCb).toHaveBeenCalledWith(channels[0], null);
    });
    expect(channelListDispatcher).toHaveBeenCalledWith({
      type: channelListActions.LEAVE_CHANNEL_SUCCESS,
      payload: 'channel-a',
    });

    fireEvent.click(screen.getByTestId('custom-preview-channel-b'));
    await waitFor(() => {
      expect(failCb).toHaveBeenCalledWith(failedChannel, expect.any(Error));
    });
    expect(logger.error).toHaveBeenCalledWith('ChannelList: Leaving channel failed', expect.any(Error));
  });

  it('does not select channels while offline without cached SDK support', () => {
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        stores: {
          sdkStore: {
            sdk: {
              isCacheEnabled: false,
            },
          },
        },
        config: {
          logger,
          isOnline: false,
        },
      },
    });

    render(<ChannelListUI />);
    fireEvent.click(screen.getByTestId('default-preview-channel-a'));

    expect(logger.warning).toHaveBeenCalledWith('ChannelList: Inactivated clicking channel item during offline.');
    expect(channelListDispatcher).not.toHaveBeenCalled();
  });
});
