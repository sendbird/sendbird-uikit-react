import React from 'react';
import { render } from '@testing-library/react';
import ChannelUI from '../index';
import { useChannelContext } from '../../../context/ChannelProvider';
import { GroupChannelUIView } from '../../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';

// ChannelUI (legacy) reads the channel context and forwards the customer's render props to the
// shared GroupChannelUIView, injecting default header/list/input renderers when absent. Mirrors
// GroupChannelUI.renderProps.integration.spec.tsx.
vi.mock('../../../context/ChannelProvider', () => ({ useChannelContext: vi.fn() }));
vi.mock('../../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView', () => ({ GroupChannelUIView: vi.fn(() => null) }));
vi.mock('../../ChannelHeader', () => ({ __esModule: true, default: () => null }));
vi.mock('../../MessageList', () => ({ __esModule: true, default: () => null }));
vi.mock('../../MessageInputWrapper', () => ({ __esModule: true, default: () => null }));

const viewProps = () => {
  const calls = vi.mocked(GroupChannelUIView).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('ChannelUI (legacy) — render-prop injection/forwarding (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChannelContext).mockReturnValue({ channelUrl: 'ch-1', isInvalid: false } as any);
  });

  it('forwards a customer renderChannelHeader to the view unchanged', () => {
    const renderChannelHeader = vi.fn(() => <div />);

    render(<ChannelUI renderChannelHeader={renderChannelHeader as any} />);

    expect(viewProps().renderChannelHeader).toBe(renderChannelHeader);
  });

  it('injects default header/list/input renderers when none are provided', () => {
    render(<ChannelUI />);

    const props = viewProps();
    expect(typeof props.renderChannelHeader).toBe('function');
    expect(typeof props.renderMessageList).toBe('function');
    expect(typeof props.renderMessageInput).toBe('function');
    // each injected default is a real renderer (produces an element)
    expect(props.renderChannelHeader({})).toBeTruthy();
    expect(props.renderMessageList({})).toBeTruthy();
    expect(props.renderMessageInput()).toBeTruthy();
  });
});
