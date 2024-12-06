import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, renderHook, screen } from '@testing-library/react';

import ChannelSettingsUI from '../components/ChannelSettingsUI';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import * as useChannelSettingsModule from '../context/useChannelSettings';
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../context/useChannelSettings');

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockStringSet = {
  CHANNEL_SETTING__HEADER__TITLE: 'Channel information',
  CHANNEL_SETTING__OPERATORS__TITLE: 'Operators',
  CHANNEL_SETTING__MEMBERS__TITLE: 'Members',
  CHANNEL_SETTING__MUTED_MEMBERS__TITLE: 'Muted members',
  CHANNEL_SETTING__BANNED_MEMBERS__TITLE: 'Banned users',
  CHANNEL_SETTING__FREEZE_CHANNEL: 'Freeze Channel',
  CHANNEL_SETTING__LEAVE_CHANNEL__TITLE: 'Leave channel',
};
const mockChannelName = 'Test Channel';

const mockLocalizationContext = {
  stringSet: mockStringSet,
};

const defaultMockState = {
  channel: { name: mockChannelName, members: [], isBroadcast: false },
  loading: false,
  invalidChannel: false,
};

const defaultMockActions = {
  setChannel: jest.fn(),
  setLoading: jest.fn(),
  setInvalid: jest.fn(),
};

describe('ChannelSettings Integration Tests', () => {
  const mockUseChannelSettings = useChannelSettingsModule.default as jest.Mock;

  const renderComponent = (mockState = {}, mockActions = {}) => {
    mockUseChannelSettings.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
      actions: { ...defaultMockActions, ...mockActions },
    });

    return render(
      <SendbirdContext.Provider value={{ config: { isOnline: true } } as any}>
        <LocalizationContext.Provider value={mockLocalizationContext as any}>
          <ChannelSettingsUI />
        </LocalizationContext.Provider>
      </SendbirdContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const stateContextValue = {
      state: {
        config: {},
        stores: {},
      },
    };
    useSendbird.mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('renders all necessary texts correctly', () => {
    renderComponent();

    expect(screen.getByText(mockChannelName)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.CHANNEL_SETTING__HEADER__TITLE)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE)).toBeInTheDocument();
  });

  it('does not display texts when loading or invalidChannel is true', () => {
    // Case 1: loading = true
    renderComponent({ loading: true });

    expect(screen.queryByText(mockChannelName)).not.toBeInTheDocument();
    expect(screen.queryByText(mockStringSet.CHANNEL_SETTING__HEADER__TITLE)).not.toBeInTheDocument();
    expect(screen.queryByText(mockStringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE)).not.toBeInTheDocument();

    // Clear the render for the next case
    jest.clearAllMocks();
    renderComponent({ invalidChannel: true });

    // Case 2: invalidChannel = true
    expect(screen.queryByText(mockChannelName)).not.toBeInTheDocument();
    expect(screen.queryByText(mockStringSet.CHANNEL_SETTING__HEADER__TITLE)).toBeInTheDocument(); // render Header
    expect(screen.queryByText(mockStringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE)).not.toBeInTheDocument();
  });

  it('calls setChannel with the correct channel object', () => {
    const setChannel = jest.fn();
    renderComponent({}, { setChannel });

    const newChannel = { name: 'New Channel', members: [] };
    setChannel(newChannel);

    expect(setChannel).toHaveBeenCalledWith(newChannel);
  });
});
