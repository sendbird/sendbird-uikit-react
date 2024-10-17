import { fireEvent, render, screen } from '@testing-library/react';
import GroupChannelListUI from '../index';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { useGroupChannelList as useGroupChannelListModule } from '../../../context/useGroupChannelList';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

jest.mock('../../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    stores: {
      userStore: {
        user: {
          userId: ' test-user-id',
        },
      },
      sdkStore: {
        sdk: {
          currentUser: {
            userId: 'test-user-id',
          },
        },
        initialized: true,
      },
    },
    config: {
      logger: console,
      userId: 'test-user-id',
      groupChannel: {
        enableMention: true,
      },
      isOnline: true,
    },
  })),
}));
jest.mock('../../../context/useGroupChannelList');
jest.mock('@sendbird/uikit-tools', () => ({
  useGroupChannelList: jest.fn(() => ({
    refreshing: false,
    initialized: false,
    groupChannels: [],
    refresh: null,
    loadMore: null,
  })),
  useGroupChannelHandler: jest.fn(() => {}),
  usePreservedCallback: jest.requireActual('@sendbird/uikit-tools').usePreservedCallback,
}));

const mockStringSet = {
  PLACE_HOLDER__NO_CHANNEL: 'No channels',
  TYPING_INDICATOR__IS_TYPING: 'is typing...',
  TYPING_INDICATOR__AND: 'and',
  TYPING_INDICATOR__ARE_TYPING: 'are typing...',
  TYPING_INDICATOR__MULTIPLE_TYPING: 'Several people are typing...',
};

const defaultMockState = {
  className: '',
  selectedChannelUrl: '',
  disableAutoSelect: false,
  allowProfileEdit: false,
  isTypingIndicatorEnabled: false,
  isMessageReceiptStatusEnabled: false,
  onChannelSelect: undefined,
  onChannelCreated: undefined,
  onThemeChange: undefined,
  onCreateChannelClick: undefined,
  onBeforeCreateChannel: undefined,
  onUserProfileUpdated: undefined,
  typingChannelUrls: [],
  refreshing: false,
  initialized: false,
  groupChannels: [],
  refresh: null,
  loadMore: null,
};

describe('GroupChannelListUI Integration Tests', () => {

  const renderComponent = (mockState = {}) => {
    const mockUseGroupChannelList = useGroupChannelListModule as jest.Mock;

    mockUseGroupChannelList.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
    });

    return render(
      <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
        <GroupChannelListUI />,
      </LocalizationContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('display loader if not initialized', () => {
    const { container } = renderComponent();

    expect(container.getElementsByClassName('sendbird-loader')[0]).toBeInTheDocument();
  });

  it('display results when available', () => {
    renderComponent({
      groupChannels: [
        { name: 'test-group-channel-1' },
        { name: 'test-group-channel-2' },
      ],
      initialized: true,
    });

    expect(screen.getByText('test-group-channel-1')).toBeInTheDocument();
    expect(screen.getByText('test-group-channel-2')).toBeInTheDocument();
  });

  it('handle no result', () => {
    renderComponent({
      groupChannels: [],
      initialized: true,
    });

    expect(screen.getByText(mockStringSet.PLACE_HOLDER__NO_CHANNEL)).toBeInTheDocument();
  });

  it('handle selectedChannelUrl', () => {
    const { container } = renderComponent({
      groupChannels: [
        { name: 'test-group-channel-1', url: 'test-group-channel-url-1' },
        { name: 'test-group-channel-2', url: 'test-group-channel-url-2' },
      ],
      selectedChannelUrl: 'test-group-channel-url-2',
      initialized: true,
    });

    const selected = container.getElementsByClassName('sendbird-channel-preview--active')[0];

    expect(selected).toBeInTheDocument();
    expect(selected.getAttribute('tabindex')).toEqual('1');
  });

  it('handle disableAutoSelect', () => {
    const { container } = renderComponent({
      groupChannels: [
        { name: 'test-group-channel-1', url: 'test-group-channel-url-1' },
        { name: 'test-group-channel-2', url: 'test-group-channel-url-2' },
      ],
      disableAutoSelect: true,
      initialized: true,
    });

    const selected = container.getElementsByClassName('sendbird-channel-preview--active')[0];

    expect(selected).toBeUndefined();
  });

  it('handle allowProfileEdit', () => {
    const { container } = renderComponent({
      allowProfileEdit: true,
      initialized: true,
    });

    expect(container.getElementsByClassName('sendbird-channel-header--allow-edit')[0]).toBeInTheDocument();
  });

  it('handle isTypingIndicatorEnabled', () => {
    renderComponent({
      groupChannels: [
        { name: 'test-group-channel-1', url: 'test-group-channel-url-1', getTypingUsers: () => ['test-user-1', 'test-user-2'] },
        { name: 'test-group-channel-2', url: 'test-group-channel-url-2', getTypingUsers: () => ['test-user-2'] },
      ],
      typingChannelUrls: ['test-group-channel-url-1', 'test-group-channel-url-2'],
      selectedChannelUrl: 'test-group-channel-url-1',
      isTypingIndicatorEnabled: true,
      initialized: true,
    });

    expect(screen.getByText(mockStringSet.TYPING_INDICATOR__IS_TYPING, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.TYPING_INDICATOR__ARE_TYPING, { exact: false })).toBeInTheDocument();
  });

  it('handle onChannelSelect', () => {
    const onChannelSelect = jest.fn();

    renderComponent({
      groupChannels: [
        { name: 'test-group-channel-1', url: 'test-group-channel-url-1' },
        { name: 'test-group-channel-2', url: 'test-group-channel-url-2' },
      ],
      initialized: true,
      onChannelSelect,
    });

    const channel = screen.getByText('test-group-channel-1');
    fireEvent.click(channel);

    expect(onChannelSelect).toHaveBeenCalledTimes(1);
  });

});
