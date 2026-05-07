import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CreateOpenChannelUI from '../index';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import { useCreateOpenChannelContext } from '../../../context/CreateOpenChannelProvider';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../context/CreateOpenChannelProvider', () => ({
  useCreateOpenChannelContext: jest.fn(),
}));

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseCreateOpenChannelContext = useCreateOpenChannelContext as jest.Mock;
const mockUseSendbird = useSendbird as jest.Mock;

const mockStringSet = {
  BUTTON__CANCEL: 'Cancel',
  CREATE_OPEN_CHANNEL_LIST__TITLE: 'New channel profile',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION: 'Channel image',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD: 'Upload',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION: 'Channel name',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER: 'Enter channel name',
  CREATE_OPEN_CHANNEL_LIST__SUBMIT: 'Create',
};

const renderComponent = (props = {}, context = {}) => {
  const logger = {
    warning: jest.fn(),
  };
  const createNewOpenChannel = jest.fn();

  mockUseSendbird.mockReturnValue({
    state: {
      eventHandlers: {},
    },
  });
  mockUseCreateOpenChannelContext.mockReturnValue({
    logger,
    createNewOpenChannel,
    ...context,
  });

  const renderResult = render(
    <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
      <CreateOpenChannelUI {...props} />
    </LocalizationContext.Provider>,
  );

  return {
    ...renderResult,
    createNewOpenChannel,
    logger,
  };
};

describe('CreateOpenChannelUI integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '<div id="sendbird-modal-root" />';
  });

  it('renders the default open-channel profile form', () => {
    renderComponent();

    expect(screen.getByText(mockStringSet.CREATE_OPEN_CHANNEL_LIST__TITLE)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER)).toBeInTheDocument();
  });

  it('warns and does not close when the channel name is empty', () => {
    const closeModal = jest.fn();
    const { createNewOpenChannel, logger } = renderComponent({ closeModal });

    fireEvent.click(screen.getByRole('button', { name: mockStringSet.CREATE_OPEN_CHANNEL_LIST__SUBMIT }));

    expect(logger.warning).toHaveBeenCalledWith('CreateOpenChannelUI: You should fill the channel name');
    expect(createNewOpenChannel).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
  });

  it('creates a channel and closes the modal when a channel name is entered', () => {
    const closeModal = jest.fn();
    const { createNewOpenChannel } = renderComponent({ closeModal });
    const nameInput = document.querySelector(
      'input[name="sendbird-create-open-channel-ui__profile-input__name-section__input"]',
    );

    (nameInput as HTMLInputElement).value = 'Community channel';
    fireEvent.click(screen.getByRole('button', { name: mockStringSet.CREATE_OPEN_CHANNEL_LIST__SUBMIT }));

    expect(createNewOpenChannel).toHaveBeenCalledWith({
      name: 'Community channel',
      coverUrlOrImage: undefined,
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
