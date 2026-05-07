import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import OpenChannelListUI from '../index';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import { useOpenChannelListContext } from '../../../context/OpenChannelListProvider';
import actionTypes from '../../../context/dux/actionTypes';
import { OpenChannelListFetchingStatus } from '../../../context/OpenChannelListInterfaces';

jest.mock('../../../context/OpenChannelListProvider', () => ({
  useOpenChannelListContext: jest.fn(),
}));

const mockUseOpenChannelListContext = useOpenChannelListContext as jest.Mock;

const mockStringSet = {
  OPEN_CHANNEL_LIST__TITLE: 'Open channels',
  PLACE_HOLDER__NO_CHANNEL: 'No channels',
  PLACE_HOLDER__WRONG: 'Something went wrong',
};

const defaultContext = {
  logger: { info: jest.fn() },
  currentChannel: null,
  allChannels: [],
  fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
  onChannelSelected: jest.fn(),
  fetchNextChannels: jest.fn(),
  refreshOpenChannelList: jest.fn(),
  openChannelListDispatcher: jest.fn(),
};

const renderComponent = (context = {}) => {
  mockUseOpenChannelListContext.mockReturnValue({
    ...defaultContext,
    ...context,
  });

  return render(
    <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
      <OpenChannelListUI />
    </LocalizationContext.Provider>,
  );
};

describe('OpenChannelListUI integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading, empty, and error placeholders by fetching status', () => {
    const { container, rerender } = renderComponent({
      fetchingStatus: OpenChannelListFetchingStatus.FETCHING,
    });
    expect(container.getElementsByClassName('sendbird-loader')[0]).toBeInTheDocument();

    mockUseOpenChannelListContext.mockReturnValue({
      ...defaultContext,
      fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
    });
    rerender(
      <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
        <OpenChannelListUI />
      </LocalizationContext.Provider>,
    );
    expect(screen.getByText(mockStringSet.PLACE_HOLDER__NO_CHANNEL)).toBeInTheDocument();

    mockUseOpenChannelListContext.mockReturnValue({
      ...defaultContext,
      fetchingStatus: OpenChannelListFetchingStatus.ERROR,
    });
    rerender(
      <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
        <OpenChannelListUI />
      </LocalizationContext.Provider>,
    );
    expect(screen.getByText(mockStringSet.PLACE_HOLDER__WRONG)).toBeInTheDocument();
  });

  it('renders available open channels and selected state', () => {
    const { container } = renderComponent({
      fetchingStatus: OpenChannelListFetchingStatus.DONE,
      currentChannel: { url: 'open-channel-2' },
      allChannels: [
        { url: 'open-channel-1', name: 'Open channel 1', participantCount: 1 },
        { url: 'open-channel-2', name: 'Open channel 2', participantCount: 2 },
      ],
    });

    expect(screen.getByText('Open channel 1')).toBeInTheDocument();
    expect(screen.getByText('Open channel 2')).toBeInTheDocument();
    expect(container.getElementsByClassName('sendbird-open-channel-preview selected')[0]).toBeInTheDocument();
  });

  it('selects channels and dispatches current channel changes', () => {
    const onChannelSelected = jest.fn();
    const openChannelListDispatcher = jest.fn();
    const selectedChannel = { url: 'open-channel-1', name: 'Open channel 1', participantCount: 1 };

    renderComponent({
      fetchingStatus: OpenChannelListFetchingStatus.DONE,
      allChannels: [selectedChannel],
      onChannelSelected,
      openChannelListDispatcher,
    });

    fireEvent.click(screen.getByText('Open channel 1'));

    expect(onChannelSelected).toHaveBeenCalledWith(selectedChannel, expect.any(Object));
    expect(openChannelListDispatcher).toHaveBeenCalledWith({
      type: actionTypes.SET_CURRENT_OPEN_CHANNEL,
      payload: selectedChannel,
    });
  });

  it('refreshes the open channel list from the header action', () => {
    const refreshOpenChannelList = jest.fn();
    const { container } = renderComponent({ refreshOpenChannelList });

    fireEvent.click(container.getElementsByClassName('sendbird-open-channel-list-ui__header__button-refresh')[0]);

    expect(refreshOpenChannelList).toHaveBeenCalledTimes(1);
  });
});
