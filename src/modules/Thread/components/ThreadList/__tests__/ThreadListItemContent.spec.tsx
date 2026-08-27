import React from 'react';
import { render } from '@testing-library/react';

import ThreadListItemContent from '../ThreadListItemContent';
import { useLocalization } from '../../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../../lib/MediaQueryContext';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import useThread from '../../../context/useThread';

vi.mock('date-fns/format', () => ({ default: () => 'mock-date' }));

vi.mock('../../../../../lib/LocalizationContext', async () => {
  const reactModule = await vi.importActual<typeof import('react')>('react');
  return {
    __esModule: true,
    LocalizationContext: reactModule.createContext({
      stringSet: { DATE_FORMAT__MESSAGE_CREATED_AT: 'p' },
    }),
    useLocalization: vi.fn(),
  };
});
vi.mock('../../../../../lib/MediaQueryContext', () => ({
  __esModule: true,
  useMediaQueryContext: vi.fn(),
}));
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(),
  useSendbird: vi.fn(),
}));
vi.mock('../../../context/useThread', () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock('../../../../Channel/context/hooks/useThreadMessageKindKeySelector', () => ({
  __esModule: true,
  useThreadMessageKindKeySelector: () => 'thread-message-kind-key',
}));
vi.mock('../../../../Channel/context/hooks/useFileInfoListWithUploaded', () => ({
  __esModule: true,
  useFileInfoListWithUploaded: () => [],
}));

const createMockChannel = () => ({
  isGroupChannel: () => true,
  isEphemeral: false,
  getUnreadMemberCount: () => 1,
  getUndeliveredMemberCount: () => 1,
}) as any;

const createMockMessage = (sendingStatus: string) => ({
  messageId: 2020,
  messageType: 'user',
  message: 'a thread reply',
  createdAt: 1579767478896,
  reactions: [],
  sendingStatus,
  parentMessageId: 0,
  parentMessage: null,
  threadInfo: { replyCount: 0 },
  sender: { profileUrl: '', userId: 'user-id-001', nickname: 'Mathew' },
  isAdminMessage: () => false,
  isUserMessage: () => true,
  isFileMessage: () => false,
  isResendable: () => false,
}) as any;

const STATUS_SELECTOR = '.sendbird-message-status';

describe('modules/Thread/ThreadListItemContent', () => {
  beforeEach(() => {
    (useMediaQueryContext as any).mockReturnValue({ isMobile: false });
    (useLocalization as any).mockReturnValue({
      dateLocale: {},
      stringSet: { DATE_FORMAT__MESSAGE_CREATED_AT: 'p' },
    });
    (useSendbird as any).mockReturnValue({
      state: {
        config: {
          logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
          groupChannel: { enableOgtag: true },
        },
        eventHandlers: {},
      },
    });
    (useThread as any).mockReturnValue({
      state: { onBeforeDownloadFileMessage: null, filterEmojiCategoryIds: undefined },
      actions: { deleteMessage: vi.fn() },
    });
  });

  // CLNP-8803 / C1
  //
  // Same defect as MessageContent: the status block was gated purely on chainBottom, so a
  // chained pending or failed reply lost its only delivery indicator.
  describe('undelivered status survives grouping', () => {
    const renderWithChain = (sendingStatus: string, chainBottom: boolean) => render(
      <ThreadListItemContent
        userId="user-id-001"
        channel={createMockChannel()}
        message={createMockMessage(sendingStatus)}
        chainBottom={chainBottom}
      />,
    );

    it('renders the status of a pending reply even when chained', () => {
      const { container } = renderWithChain('pending', true);
      expect(container.querySelector(STATUS_SELECTOR)).toBeTruthy();
    });

    it('renders the status of a failed reply even when chained', () => {
      const { container } = renderWithChain('failed', true);
      expect(container.querySelector(STATUS_SELECTOR)).toBeTruthy();
    });

    it('still hides the status of a chained succeeded reply', () => {
      const { container } = renderWithChain('succeeded', true);
      expect(container.querySelector(STATUS_SELECTOR)).toBe(null);
    });

    it('still shows the status of an unchained succeeded reply', () => {
      const { container } = renderWithChain('succeeded', false);
      expect(container.querySelector(STATUS_SELECTOR)).toBeTruthy();
    });
  });

  // A reply from someone else can never be pending or failed, so every incoming branch must
  // keep following chainBottom exactly as before.
  describe('incoming replies keep their chain behaviour', () => {
    const renderIncoming = (chainBottom: boolean) => render(
      <ThreadListItemContent
        userId="another-user"
        channel={createMockChannel()}
        message={createMockMessage('succeeded')}
        chainBottom={chainBottom}
      />,
    );

    it('hides the sender avatar when chained', () => {
      const { container } = renderIncoming(true);
      expect(
        container.querySelector('.sendbird-thread-list-item-content__left__avatar'),
      ).toBe(null);
    });

    it('shows the sender avatar when not chained', () => {
      const { container } = renderIncoming(false);
      expect(
        container.querySelector('.sendbird-thread-list-item-content__left__avatar'),
      ).toBeTruthy();
    });

    it('never renders the outgoing status block for an incoming reply', () => {
      expect(renderIncoming(false).container.querySelector(STATUS_SELECTOR)).toBe(null);
      expect(renderIncoming(true).container.querySelector(STATUS_SELECTOR)).toBe(null);
    });
  });
});
