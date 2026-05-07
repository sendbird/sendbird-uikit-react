import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  CreateOpenChannelProvider,
  useCreateOpenChannelContext,
} from '../CreateOpenChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseSendbird = useSendbird as jest.Mock;

const renderCreateOpenChannelHook = ({
  initialized = true,
  onCreateChannel = jest.fn(),
  onBeforeCreateChannel,
}: {
  initialized?: boolean;
  onCreateChannel?: jest.Mock;
  onBeforeCreateChannel?: jest.Mock;
} = {}) => {
  const createdChannel = { url: 'created-open-channel' };
  const createChannel = jest.fn().mockResolvedValue(createdChannel);
  const logger = {
    info: jest.fn(),
    warning: jest.fn(),
  };
  const sdk = {
    currentUser: {
      userId: 'operator-user',
    },
    openChannel: {
      createChannel,
    },
  };

  mockUseSendbird.mockReturnValue({
    state: {
      stores: {
        sdkStore: {
          sdk,
          initialized,
        },
      },
      config: {
        logger,
      },
    },
  });

  const wrapper = ({ children }) => (
    <CreateOpenChannelProvider
      onCreateChannel={onCreateChannel}
      onBeforeCreateChannel={onBeforeCreateChannel}
    >
      {children}
    </CreateOpenChannelProvider>
  );

  return {
    ...renderHook(() => useCreateOpenChannelContext(), { wrapper }),
    createChannel,
    createdChannel,
    logger,
    onCreateChannel,
    sdk,
  };
};

describe('CreateOpenChannelProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when the hook is used outside of CreateOpenChannelProvider', () => {
    expect(() => {
      renderHook(() => useCreateOpenChannelContext());
    }).toThrow(new Error('CreateOpenChannelContext not found. Use within the CreateOpenChannel module.'));
  });

  it('provides sdk state and logger from Sendbird context', () => {
    const { result, logger, sdk } = renderCreateOpenChannelHook();

    expect(result.current.sdk).toBe(sdk);
    expect(result.current.sdkInitialized).toBe(true);
    expect(result.current.logger).toBe(logger);
    expect(result.current.createNewOpenChannel).toEqual(expect.any(Function));
  });

  it('creates an open channel with operator defaults and before-create overrides', async () => {
    const onBeforeCreateChannel = jest.fn((params) => ({
      ...params,
      customType: 'community',
    }));
    const onCreateChannel = jest.fn();
    const {
      result,
      createChannel,
      createdChannel,
      logger,
    } = renderCreateOpenChannelHook({ onBeforeCreateChannel, onCreateChannel });

    act(() => {
      result.current.createNewOpenChannel({
        name: 'Open channel',
        coverUrlOrImage: 'cover-url',
      });
    });

    await waitFor(() => {
      expect(createChannel).toHaveBeenCalledWith({
        operatorUserIds: ['operator-user'],
        name: 'Open channel',
        coverUrlOrImage: 'cover-url',
        customType: 'community',
      });
    });
    expect(onBeforeCreateChannel).toHaveBeenCalledWith({
      operatorUserIds: ['operator-user'],
      name: 'Open channel',
      coverUrlOrImage: 'cover-url',
    });
    expect(logger.info).toHaveBeenCalledWith(
      'CreateOpenChannel: Succeeded creating openChannel',
      createdChannel,
    );
    expect(onCreateChannel).toHaveBeenCalledWith(createdChannel);
  });

  it('does not create a channel before the SDK is initialized', () => {
    const { result, createChannel } = renderCreateOpenChannelHook({ initialized: false });

    act(() => {
      result.current.createNewOpenChannel({ name: 'Open channel' });
    });

    expect(createChannel).not.toHaveBeenCalled();
  });
});
