import React from 'react';
import { act, render, renderHook } from '@testing-library/react';
import { OpenChannelProvider, useOpenChannelContext } from '../OpenChannelProvider';
import pubSubFactory from '../../../../lib/pubSub';
import topics from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';

vi.mock('../utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils')>();
  return { ...actual, scrollIntoLast: vi.fn() };
});

const CURRENT_CHANNEL_URL = 'current-open-channel';
const OTHER_CHANNEL_URL = 'other-channel';

const mockLogger = { info: vi.fn(), warning: vi.fn(), error: vi.fn() };

const pubSub = pubSubFactory({ publishSynchronous: true });

const mockSdk = {
  currentUser: { userId: 'test-user' },
  openChannel: {
    getChannel: vi.fn(() => new Promise(() => {})),
    addOpenChannelHandler: vi.fn(),
    removeOpenChannelHandler: vi.fn(),
  },
};

const mockState = {
  stores: {
    sdkStore: { sdk: mockSdk, initialized: true },
    userStore: { user: { userId: 'test-user' } },
  },
  config: {
    userId: 'test-user',
    isOnline: true,
    logger: mockLogger,
    pubSub,
    imageCompression: {},
  },
};

vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

const renderProvider = (channelUrl = CURRENT_CHANNEL_URL) => {
  const wrapper = ({ children }) => (
    <OpenChannelProvider channelUrl={channelUrl}>
      {children as React.ReactElement}
    </OpenChannelProvider>
  );
  return renderHook(() => useOpenChannelContext(), { wrapper });
};

const publishSend = (topic: string, channelUrl?: string) => {
  act(() => {
    pubSub.publish(topic, {
      channel: channelUrl ? { url: channelUrl } : undefined,
      message: { messageId: 1, reqId: 'req-1' },
    });
  });
};

describe('OpenChannelProvider - scroll isolation across channels (SBISSUE-22040 / CLNP-8898)', () => {
  describe('SEND_USER_MESSAGE', () => {
    it('scrolls to the bottom when the message belongs to the current channel', () => {
      renderProvider();
      publishSend(topics.SEND_USER_MESSAGE, CURRENT_CHANNEL_URL);
      expect(vi.mocked(scrollIntoLast)).toHaveBeenCalledTimes(1);
    });

    it('does NOT scroll when the message is sent in a different channel', () => {
      renderProvider();
      publishSend(topics.SEND_USER_MESSAGE, OTHER_CHANNEL_URL);
      expect(vi.mocked(scrollIntoLast)).not.toHaveBeenCalled();
    });

    it('does NOT scroll when the payload carries no channel', () => {
      renderProvider();
      publishSend(topics.SEND_USER_MESSAGE, undefined);
      expect(vi.mocked(scrollIntoLast)).not.toHaveBeenCalled();
    });
  });

  describe('SEND_FILE_MESSAGE', () => {
    it('scrolls to the bottom when the file message belongs to the current channel', () => {
      renderProvider();
      publishSend(topics.SEND_FILE_MESSAGE, CURRENT_CHANNEL_URL);
      expect(vi.mocked(scrollIntoLast)).toHaveBeenCalledTimes(1);
    });

    it('does NOT scroll when the file message is sent in a different channel', () => {
      renderProvider();
      publishSend(topics.SEND_FILE_MESSAGE, OTHER_CHANNEL_URL);
      expect(vi.mocked(scrollIntoLast)).not.toHaveBeenCalled();
    });
  });

  describe('multiple providers sharing one SendbirdProvider (SBISSUE-22040 repro)', () => {
    it('a send scrolls only the channel it belongs to, using its own scroll ref', () => {
      const scrollRefs: Record<string, React.RefObject<HTMLDivElement>> = {};
      const CaptureScrollRef = ({ url }: { url: string }) => {
        scrollRefs[url] = useOpenChannelContext().conversationScrollRef;
        return null;
      };
      render(
        <>
          <OpenChannelProvider channelUrl={CURRENT_CHANNEL_URL}>
            <CaptureScrollRef url={CURRENT_CHANNEL_URL} />
          </OpenChannelProvider>
          <OpenChannelProvider channelUrl={OTHER_CHANNEL_URL}>
            <CaptureScrollRef url={OTHER_CHANNEL_URL} />
          </OpenChannelProvider>
        </>,
      );
      publishSend(topics.SEND_USER_MESSAGE, OTHER_CHANNEL_URL);

      expect(scrollRefs[CURRENT_CHANNEL_URL]).toBeDefined();
      expect(scrollRefs[OTHER_CHANNEL_URL]).toBeDefined();
      expect(scrollRefs[OTHER_CHANNEL_URL]).not.toBe(scrollRefs[CURRENT_CHANNEL_URL]);

      const calls = vi.mocked(scrollIntoLast).mock.calls;
      expect(calls).toHaveLength(1);
      expect(calls[0][1]).toBe(scrollRefs[OTHER_CHANNEL_URL]);
    });
  });

  it('does NOT scroll on SEND_MESSAGE_START, even for the current channel', () => {
    renderProvider();
    publishSend(topics.SEND_MESSAGE_START, CURRENT_CHANNEL_URL);
    expect(vi.mocked(scrollIntoLast)).not.toHaveBeenCalled();
  });

  it('stops reacting to sends after unmount', () => {
    const { unmount } = renderProvider();
    unmount();
    publishSend(topics.SEND_USER_MESSAGE, CURRENT_CHANNEL_URL);
    expect(vi.mocked(scrollIntoLast)).not.toHaveBeenCalled();
  });
});
