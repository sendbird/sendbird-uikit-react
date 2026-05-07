import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

const mockCreateChannel = jest.fn();
const mockUseSendbird = useSendbird as jest.Mock;

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../components/CreateOpenChannelUI', () => {
  const React = require('react');
  const { useCreateOpenChannelContext } = require('../context/CreateOpenChannelProvider');

  return {
    __esModule: true,
    default: ({ closeModal }) => {
      const context = useCreateOpenChannelContext();

      return React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            context.createNewOpenChannel({ name: 'Created from UI' });
            closeModal?.();
          },
        },
        'CreateOpenChannelUI',
      );
    },
  };
});

import CreateOpenChannel from '..';

describe('CreateOpenChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateChannel.mockResolvedValue({ url: 'created-open-channel' });
    mockUseSendbird.mockReturnValue({
      state: {
        stores: {
          sdkStore: {
            sdk: {
              currentUser: {
                userId: 'operator-user',
              },
              openChannel: {
                createChannel: mockCreateChannel,
              },
            },
            initialized: true,
          },
        },
        config: {
          logger: {
            info: jest.fn(),
            warning: jest.fn(),
          },
        },
      },
    });
  });

  it('renders CreateOpenChannelUI inside its provider and wires create callbacks', async () => {
    const closeModal = jest.fn();
    const onBeforeCreateChannel = jest.fn((params) => ({
      ...params,
      customType: 'custom-open-channel',
    }));
    const onCreateChannel = jest.fn();
    const { container } = render(
      <CreateOpenChannel
        className="custom-create-open-channel"
        closeModal={closeModal}
        onBeforeCreateChannel={onBeforeCreateChannel}
        onCreateChannel={onCreateChannel}
      />,
    );

    expect(container.getElementsByClassName('sendbird-create-open-channel custom-create-open-channel')[0]).toBeInTheDocument();

    fireEvent.click(screen.getByText('CreateOpenChannelUI'));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledWith({
        operatorUserIds: ['operator-user'],
        name: 'Created from UI',
        coverUrlOrImage: undefined,
        customType: 'custom-open-channel',
      });
    });
    expect(onBeforeCreateChannel).toHaveBeenCalledWith({
      operatorUserIds: ['operator-user'],
      name: 'Created from UI',
      coverUrlOrImage: undefined,
    });
    expect(onCreateChannel).toHaveBeenCalledWith({ url: 'created-open-channel' });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
