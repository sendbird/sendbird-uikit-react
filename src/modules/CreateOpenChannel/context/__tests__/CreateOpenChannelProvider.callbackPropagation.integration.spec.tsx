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

describe('CreateOpenChannelProvider — callback propagation (integration)', () => {
  it('invokes onBeforeCreateChannel and onCreateChannel through the create flow', async () => {
    const createChannel = vi.fn().mockResolvedValue(mockCreatedChannel);
    vi.mocked(useSendbird).mockReturnValue({
      state: {
        stores: { sdkStore: { sdk: { openChannel: { createChannel }, currentUser: { userId: 'me' } }, initialized: true } },
        config: { logger: console },
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
    expect(onBeforeCreateChannel).toHaveBeenCalledWith(expect.objectContaining({ name: 'My Open Channel' }));
    expect(createChannel).toHaveBeenCalledWith(expect.objectContaining({ name: 'My Open Channel' }));
    // onCreateChannel receives the created channel after the SDK resolves
    await waitFor(() => expect(onCreateChannel).toHaveBeenCalledWith(mockCreatedChannel));
  });
});
