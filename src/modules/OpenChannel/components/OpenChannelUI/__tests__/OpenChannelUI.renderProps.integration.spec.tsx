import React from 'react';
import { render } from '@testing-library/react';
import OpenChannelUI from '../index';
import { useOpenChannelContext } from '../../../context/OpenChannelProvider';
import OpenChannelMessageList from '../../OpenChannelMessageList';
import OpenChannelHeader from '../../OpenChannelHeader';
import OpenChannelInput from '../../OpenChannelInput';

// OpenChannelUI reads the open-channel context and either forwards the customer's render props to
// its children or injects the default header/list/input. Mock the context + children to capture
// forwarded props and detect default injection.
vi.mock('../../../context/OpenChannelProvider', () => ({ useOpenChannelContext: vi.fn() }));
vi.mock('../../OpenChannelMessageList', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../OpenChannelHeader', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../OpenChannelInput', () => ({ __esModule: true, default: vi.fn(() => null) }));

const baseContext = {
  currentOpenChannel: { url: 'open-1', isFrozen: false },
  amIBanned: false,
  loading: false,
  isInvalid: false,
  messageInputRef: { current: null },
  conversationScrollRef: { current: null },
};

const lastListProps = () => {
  const calls = vi.mocked(OpenChannelMessageList).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('OpenChannelUI — render-prop injection/forwarding (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOpenChannelContext).mockReturnValue(baseContext as any);
  });

  it('forwards a customer renderMessage to the message list and renderHeader over the default', () => {
    const renderMessage = vi.fn(() => <div />);
    const renderHeader = vi.fn(() => <div data-testid="custom-header" />);

    render(<OpenChannelUI renderMessage={renderMessage as any} renderHeader={renderHeader} />);

    // renderMessage reaches OpenChannelMessageList unchanged (same reference)
    expect(lastListProps().renderMessage).toBe(renderMessage);
    // custom header used; default OpenChannelHeader NOT rendered
    expect(renderHeader).toHaveBeenCalled();
    expect(vi.mocked(OpenChannelHeader)).not.toHaveBeenCalled();
  });

  it('injects the default header/input when no render props are provided', () => {
    render(<OpenChannelUI />);

    expect(vi.mocked(OpenChannelHeader)).toHaveBeenCalled();
    expect(vi.mocked(OpenChannelInput)).toHaveBeenCalled();
    expect(lastListProps().renderMessage).toBeUndefined();
  });
});
