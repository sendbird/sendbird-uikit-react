import React from 'react';
import { render } from '@testing-library/react';
import ThreadUI from '../index';
import useThread from '../../../context/useThread';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../../lib/LocalizationContext';
import ThreadList from '../../ThreadList';
import ThreadMessageInput from '../../ThreadMessageInput';

// ThreadUI forwards the customer's render props to its children (ThreadList / ThreadMessageInput)
// or injects defaults. Mock the context hooks + children, and neutralize the memo hooks so the
// default children render deterministically (and getChannelTitle in the default header is skipped).
vi.mock('../../../context/useThread', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../../../../lib/LocalizationContext', async () => ({
  ...(await vi.importActual('../../../../../lib/LocalizationContext')),
  useLocalization: vi.fn(),
}));
vi.mock('../../ThreadList', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../ThreadMessageInput', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../ThreadHeader', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../ParentMessageInfo', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../../../Message/context/MessageProvider', () => ({ MessageProvider: ({ children }: any) => children }));
vi.mock('../useMemorizedHeader', () => ({ __esModule: true, default: vi.fn(() => 'header') }));
vi.mock('../useMemorizedParentMessageInfo', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../useMemorizedThreadList', () => ({ __esModule: true, default: vi.fn(() => null) }));

const threadState = {
  currentChannel: { url: 'ch-1' },
  allThreadMessages: [],
  parentMessage: { sender: { userId: 'user-1' } },
  parentMessageState: 'INITIALIZED',
  threadListState: 'INITIALIZED',
  hasMorePrev: false,
  hasMoreNext: false,
  onHeaderActionClick: vi.fn(),
  onMoveToParentMessage: vi.fn(),
};

const lastThreadListProps = () => {
  const calls = vi.mocked(ThreadList).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('ThreadUI — render-prop injection/forwarding (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useThread).mockReturnValue({
      state: threadState,
      actions: { fetchPrevThreads: vi.fn(), fetchNextThreads: vi.fn() },
    } as any);
    vi.mocked(useSendbird).mockReturnValue({
      state: { stores: { sdkStore: { sdk: { currentUser: { userId: 'user-1' } } } }, config: {} },
    } as any);
    vi.mocked(useLocalization).mockReturnValue({
      stringSet: { THREAD__THREAD_REPLIES: 'replies', THREAD__THREAD_REPLY: 'reply' },
    } as any);
  });

  it('forwards a customer renderMessage to the ThreadList and renderMessageInput over the default', () => {
    const renderMessage = vi.fn(() => <div />);
    const renderMessageInput = vi.fn(() => <div data-testid="custom-input" />);

    render(<ThreadUI renderMessage={renderMessage as any} renderMessageInput={renderMessageInput} />);

    expect(lastThreadListProps().renderMessage).toBe(renderMessage);
    expect(renderMessageInput).toHaveBeenCalled();
    expect(vi.mocked(ThreadMessageInput)).not.toHaveBeenCalled();
  });

  it('injects the default ThreadMessageInput when renderMessageInput is not provided', () => {
    render(<ThreadUI />);

    expect(vi.mocked(ThreadMessageInput)).toHaveBeenCalled();
    expect(lastThreadListProps().renderMessage).toBeUndefined();
  });
});
