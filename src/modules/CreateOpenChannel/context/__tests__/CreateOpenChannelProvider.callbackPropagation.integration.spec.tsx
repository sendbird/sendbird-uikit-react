import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { CreateOpenChannelProvider, useCreateOpenChannelContext } from '../CreateOpenChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

// CreateOpenChannel does NOT expose its callbacks on the context (they are closed over inside
// createNewOpenChannel). So verify propagation by invoking the create flow: onBeforeCreateChannel
// must transform the params passed to sdk.openChannel.createChannel, and onCreateChannel must
// receive the created channel.
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));

const mockCreatedChannel = { url: 'created-open-channel' };

const defaultParams = { operatorUserIds: ['me'], name: 'My Open Channel', coverUrlOrImage: undefined };

const mountCreateFlow = async ({ initialized = true, ...props }: Record<string, any> = {}) => {
  const createChannel = vi.fn().mockResolvedValue(mockCreatedChannel);
  vi.mocked(useSendbird).mockReturnValue({
    state: {
      stores: { sdkStore: { sdk: { openChannel: { createChannel }, currentUser: { userId: 'me' } }, initialized } },
      config: { logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() } },
    },
  } as any);

  const wrapper = ({ children }) => (
    <CreateOpenChannelProvider {...props}>{children}</CreateOpenChannelProvider>
  );
  const { result } = renderHook(() => useCreateOpenChannelContext(), { wrapper });

  await act(async () => {
    result.current.createNewOpenChannel({ name: 'My Open Channel' });
    await Promise.resolve();
  });
  return { createChannel };
};

describe('CreateOpenChannelProvider — callback propagation (integration)', () => {
  it('invokes onBeforeCreateChannel and onCreateChannel through the create flow', async () => {
    const createChannel = vi.fn().mockResolvedValue(mockCreatedChannel);
    vi.mocked(useSendbird).mockReturnValue({
      state: {
        stores: { sdkStore: { sdk: { openChannel: { createChannel }, currentUser: { userId: 'me' } }, initialized: true } },
        config: { logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() } },
      },
    } as any);

    const onBeforeCreateChannel = vi.fn((params) => params);
    const onCreateChannel = vi.fn();

    const wrapper = ({ children }) => (
      <CreateOpenChannelProvider onBeforeCreateChannel={onBeforeCreateChannel} onCreateChannel={onCreateChannel}>
        {children}
      </CreateOpenChannelProvider>
    );

    const { result } = renderHook(() => useCreateOpenChannelContext(), { wrapper });

    await act(async () => {
      result.current.createNewOpenChannel({ name: 'My Open Channel' });
      await Promise.resolve();
    });

    // onBeforeCreateChannel receives (and can transform) the params handed to the SDK
    expect(onBeforeCreateChannel).toHaveBeenCalledWith(defaultParams);
    expect(createChannel).toHaveBeenCalledWith(defaultParams);
    // onCreateChannel receives the created channel after the SDK resolves
    await waitFor(() => expect(onCreateChannel).toHaveBeenCalledWith(mockCreatedChannel));
  });

  it.each([undefined, null])('falls back to the default params when onBeforeCreateChannel returns %s', async (returned) => {
    const onBeforeCreateChannel = vi.fn(() => returned as any);
    const { createChannel } = await mountCreateFlow({ onBeforeCreateChannel });

    expect(onBeforeCreateChannel).toHaveBeenCalledWith(defaultParams);
    expect(createChannel).toHaveBeenCalledWith(defaultParams);
  });

  it('creates no channel and invokes no callback while the SDK is not initialized', async () => {
    const onBeforeCreateChannel = vi.fn();
    const onCreateChannel = vi.fn();
    const { createChannel } = await mountCreateFlow({ initialized: false, onBeforeCreateChannel, onCreateChannel });

    expect(createChannel).not.toHaveBeenCalled();
    expect(onBeforeCreateChannel).not.toHaveBeenCalled();
    expect(onCreateChannel).not.toHaveBeenCalled();
  });

  it('hands the SDK what onBeforeCreateChannel returned, not the params it was given', async () => {
    // A distinct object, so a build that calls the callback and then drops its return value fails
    // here. Every other case in this file passes an identity callback and cannot tell the two apart.
    const transformed = { operatorUserIds: ['me'], name: 'renamed by the app', isDistinct: true };
    const onBeforeCreateChannel = vi.fn(() => transformed as any);

    const { createChannel } = await mountCreateFlow({ onBeforeCreateChannel });

    expect(onBeforeCreateChannel).toHaveBeenCalledWith(defaultParams);
    expect(createChannel).toHaveBeenCalledWith(transformed);
  });
});
