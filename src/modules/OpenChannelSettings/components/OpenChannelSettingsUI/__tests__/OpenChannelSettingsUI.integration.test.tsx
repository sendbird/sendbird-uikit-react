import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import OpenChannelSettingsUI from '../index';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import { useOpenChannelSettingsContext } from '../../../context/OpenChannelSettingsProvider';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../context/OpenChannelSettingsProvider', () => ({
  useOpenChannelSettingsContext: jest.fn(),
}));
jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseOpenChannelSettingsContext = useOpenChannelSettingsContext as jest.Mock;
const mockUseSendbird = useSendbird as jest.Mock;

const mockStringSet = {
  CHANNEL_SETTING__HEADER__TITLE: 'Channel information',
  OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE: 'Participants',
  PLACE_HOLDER__WRONG: 'Something went wrong',
};
const mockUser = { userId: 'current-user' };

const renderComponent = (context = {}, props = {}) => {
  mockUseOpenChannelSettingsContext.mockReturnValue({
    channel: {
      isOperator: jest.fn(() => false),
    },
    onCloseClick: jest.fn(),
    isChannelInitialized: true,
    ...context,
  });

  mockUseSendbird.mockReturnValue({
    state: {
      config: {
        logger: { info: jest.fn() },
        theme: 'light',
      },
      stores: {
        userStore: { user: mockUser },
      },
    },
  });

  return render(
    <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
      <OpenChannelSettingsUI {...props} />
    </LocalizationContext.Provider>,
  );
};

describe('OpenChannelSettingsUI integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders operator UI for channel operators', () => {
    renderComponent(
      {
        channel: {
          isOperator: jest.fn(() => true),
        },
      },
      {
        renderOperatorUI: () => <div>Operator UI</div>,
      },
    );

    expect(screen.getByText('Operator UI')).toBeInTheDocument();
  });

  it('renders participant UI for non-operators and handles close', () => {
    const onCloseClick = jest.fn();
    const { container } = renderComponent(
      {
        onCloseClick,
        channel: {
          isOperator: jest.fn(() => false),
        },
      },
      {
        renderParticipantList: () => <div>Participant UI</div>,
      },
    );

    expect(screen.getByText(mockStringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE)).toBeInTheDocument();
    expect(screen.getByText('Participant UI')).toBeInTheDocument();

    fireEvent.click(container.getElementsByClassName('sendbird-openchannel-settings__close-icon')[0]);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });

  it('renders invalid channel state after channel initialization', () => {
    const onCloseClick = jest.fn();
    const { container } = renderComponent({
      channel: null,
      isChannelInitialized: true,
      onCloseClick,
    });

    expect(screen.getByText(mockStringSet.CHANNEL_SETTING__HEADER__TITLE)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.PLACE_HOLDER__WRONG)).toBeInTheDocument();

    fireEvent.click(container.getElementsByClassName('sendbird-openchannel-settings__close-icon')[0]);
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });
});
