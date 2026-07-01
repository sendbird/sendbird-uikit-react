import React from 'react';
import { render } from '@testing-library/react';
import { GroupChannelUI } from '../index';
import { GroupChannelUIView } from '../GroupChannelUIView';
import { useGroupChannelContext } from '../../../context/GroupChannelProvider';
import { useGroupChannel } from '../../../context/hooks/useGroupChannel';

// The view's INVOCATION of these render props is already covered (GroupChannelUIView.integration.test.tsx).
// This covers the other half: GroupChannelUI forwards a customer's render prop to the view, and injects
// a default renderer when none is provided.
vi.mock('../GroupChannelUIView', () => ({ GroupChannelUIView: vi.fn(() => null) }));
vi.mock('../../../context/GroupChannelProvider', () => ({ useGroupChannelContext: vi.fn(() => ({})) }));
vi.mock('../../../context/hooks/useGroupChannel', () => ({ useGroupChannel: vi.fn() }));

const viewProps = () => {
  const calls = vi.mocked(GroupChannelUIView).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('GroupChannelUI — render-prop injection/forwarding (integration)', () => {
  beforeEach(() => {
    vi.mocked(useGroupChannelContext).mockReturnValue({} as any);
    vi.mocked(useGroupChannel).mockReturnValue({ state: { channelUrl: 'ch-1', fetchChannelError: null } } as any);
  });

  it('forwards customer render props to the view unchanged', () => {
    const renderChannelHeader = vi.fn(() => <div />);
    const renderMessageInput = vi.fn(() => <div />);
    const renderMessageList = vi.fn(() => <div />);

    render(
      <GroupChannelUI
        renderChannelHeader={renderChannelHeader as any}
        renderMessageInput={renderMessageInput as any}
        renderMessageList={renderMessageList as any}
      />,
    );

    const props = viewProps();
    expect(props.renderChannelHeader).toBe(renderChannelHeader);
    expect(props.renderMessageInput).toBe(renderMessageInput);
    expect(props.renderMessageList).toBe(renderMessageList);
  });

  it('injects default renderers when none are provided', () => {
    render(<GroupChannelUI />);

    const props = viewProps();
    expect(typeof props.renderChannelHeader).toBe('function');
    expect(typeof props.renderMessageList).toBe('function');
    expect(typeof props.renderMessageInput).toBe('function');
    // the injected default is a real renderer (produces an element)
    expect(props.renderChannelHeader({})).toBeTruthy();
  });
});
