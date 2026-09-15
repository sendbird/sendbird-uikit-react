import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OpenChannelListUI from '../index';
import { useOpenChannelListContext } from '../../../context/OpenChannelListProvider';
import { OpenChannelListFetchingStatus } from '../../../context/OpenChannelListInterfaces';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

// Verify the customer's render props reach the open-channel list: renderChannelPreview is invoked
// per channel with the channel item, and renderHeader replaces the default header. Mirrors
// GroupChannelListUI.renderProps.integration.spec.tsx.
vi.mock('../../../context/OpenChannelListProvider', () => ({ useOpenChannelListContext: vi.fn() }));
// Heavy leaves that are never under test here — stub them so a bare render is cheap/safe.
vi.mock('../../OpenChannelPreview', () => ({ __esModule: true, default: () => <div data-testid="default-preview" /> }));
vi.mock('../../../../CreateOpenChannel', () => ({ __esModule: true, default: () => null }));

const stringSet = { OPEN_CHANNEL_LIST__TITLE: 'Open channels' } as any;

const baseState = {
  logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
  currentChannel: null,
  allChannels: [],
  fetchingStatus: OpenChannelListFetchingStatus.DONE,
  onChannelSelected: vi.fn(),
  fetchNextChannels: vi.fn(),
  refreshOpenChannelList: vi.fn(),
  openChannelListDispatcher: vi.fn(),
};

const renderUI = (state: Record<string, unknown> = {}, uiProps: Record<string, unknown> = {}) => {
  vi.mocked(useOpenChannelListContext).mockReturnValue({ ...baseState, ...state } as any);
  return render(
    <LocalizationContext.Provider value={{ stringSet } as any}>
      <OpenChannelListUI {...uiProps} />
    </LocalizationContext.Provider>,
  );
};

describe('OpenChannelListUI — render-prop propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invokes a custom renderChannelPreview for each channel with the channel item', () => {
    const channels = [{ url: 'open-1' }, { url: 'open-2' }];
    const renderChannelPreview = vi.fn(() => <div data-testid="custom-preview" />);

    renderUI({ allChannels: channels, fetchingStatus: OpenChannelListFetchingStatus.DONE }, { renderChannelPreview });

    expect(renderChannelPreview).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[0] }));
    expect(renderChannelPreview).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[1] }));
  });

  it('re-invokes an updated renderChannelPreview even when the channel list reference is unchanged', () => {
    const channels = [{ url: 'open-1' }];
    const first = vi.fn(() => <div />);
    const second = vi.fn(() => <div />);

    const view = renderUI(
      { allChannels: channels, fetchingStatus: OpenChannelListFetchingStatus.DONE },
      { renderChannelPreview: first },
    );
    // Re-render with a NEW render prop but the SAME allChannels reference. Regression guard for a
    // stale MemoizedAllChannels useMemo that omitted renderChannelPreview from its deps.
    view.rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <OpenChannelListUI renderChannelPreview={second} />
      </LocalizationContext.Provider>,
    );

    expect(second).toHaveBeenCalledWith(expect.objectContaining({ channel: channels[0] }));
  });

  it('invokes a custom renderHeader (replacing the default header)', () => {
    const renderHeader = vi.fn(() => <div data-testid="custom-header" />);

    const { getByTestId } = renderUI({}, { renderHeader });

    expect(renderHeader).toHaveBeenCalled();
    // the custom header actually renders in place of the default
    expect(getByTestId('custom-header')).toBeInTheDocument();
  });

  it('invokes onChannelSelected with the clicked channel', () => {
    const channels = [{ url: 'open-1' }];
    const onChannelSelected = vi.fn();
    const renderChannelPreview = vi.fn(() => <div data-testid="preview" />);

    const { container } = renderUI(
      { allChannels: channels, onChannelSelected, fetchingStatus: OpenChannelListFetchingStatus.DONE },
      { renderChannelPreview },
    );

    // The wrapper around a custom preview carries the onClick that fires onChannelSelected.
    const item = container.querySelector('.sendbird-open-channel-list-ui__channel-list__item');
    fireEvent.click(item as Element);

    expect(onChannelSelected).toHaveBeenCalledWith(expect.objectContaining({ url: 'open-1' }), expect.anything());
  });

  it.each([
    [OpenChannelListFetchingStatus.EMPTY, 'renderPlaceHolderEmpty'],
    [OpenChannelListFetchingStatus.FETCHING, 'renderPlaceHolderLoading'],
    [OpenChannelListFetchingStatus.ERROR, 'renderPlaceHolderError'],
  ])('shows %s through its placeholder render prop and renders no channel item', (fetchingStatus, placeholderProp) => {
    const renderChannelPreview = vi.fn(() => <div />);
    const placeholder = vi.fn(() => <div data-testid="placeholder" />);
    const { getByTestId } = renderUI(
      { fetchingStatus, allChannels: [{ url: 'open-1' }] },
      { renderChannelPreview, [placeholderProp as string]: placeholder },
    );

    expect(placeholder).toHaveBeenCalled();
    expect(getByTestId('placeholder')).toBeTruthy();
    expect(renderChannelPreview).not.toHaveBeenCalled();
  });

  it('keeps the channel clickable when a custom renderChannelPreview renders nothing', () => {
    const onChannelSelected = vi.fn();
    const channel = { url: 'open-1' };
    const { container } = renderUI(
      { allChannels: [channel], onChannelSelected },
      { renderChannelPreview: () => null },
    );

    const item = container.querySelector('.sendbird-open-channel-list-ui__channel-list__item');
    expect(item).toBeTruthy();
    fireEvent.click(item!);
    expect(onChannelSelected).toHaveBeenCalledWith(channel, expect.anything());
  });

  const rerenderWith = (view: ReturnType<typeof renderUI>, state: Record<string, unknown>, uiProps: Record<string, unknown>) => {
    vi.mocked(useOpenChannelListContext).mockReturnValue({ ...baseState, ...state } as any);
    view.rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <OpenChannelListUI {...uiProps} />
      </LocalizationContext.Provider>,
    );
  };

  it('uses an updated onChannelSelected even when the channel list and render prop are unchanged', () => {
    const channels = [{ url: 'open-1' }];
    const renderChannelPreview = () => <div data-testid="custom-preview" />;
    const first = vi.fn();
    const second = vi.fn();

    const view = renderUI(
      { allChannels: channels, fetchingStatus: OpenChannelListFetchingStatus.DONE, onChannelSelected: first },
      { renderChannelPreview },
    );
    // Same allChannels reference, same render prop — only the callback changes. Regression guard for
    // a MemoizedAllChannels useMemo that omitted onChannelSelected from its deps.
    rerenderWith(
      view,
      { allChannels: channels, fetchingStatus: OpenChannelListFetchingStatus.DONE, onChannelSelected: second },
      { renderChannelPreview },
    );

    fireEvent.click(view.container.querySelector('.sendbird-open-channel-list-ui__channel-list__item')!);

    expect(second).toHaveBeenCalledWith(channels[0], expect.anything());
    expect(first).not.toHaveBeenCalled();
  });

  it('drops the channel items when fetchingStatus leaves DONE with the same channel list', () => {
    const channels = [{ url: 'open-1' }];
    const renderChannelPreview = () => <div data-testid="custom-preview" />;
    const item = () => view.container.querySelector('.sendbird-open-channel-list-ui__channel-list__item');

    const view = renderUI(
      { allChannels: channels, fetchingStatus: OpenChannelListFetchingStatus.DONE },
      { renderChannelPreview },
    );
    expect(item()).toBeTruthy();

    // Same allChannels reference; only the status moves. This covers the behavior, not the hand-written
    // dep: React Compiler re-infers fetchingStatus for this memo, so dropping it from the deps array
    // does not regress. renderChannelPreview and onChannelSelected are not re-inferred and are guarded
    // by the two tests above.
    rerenderWith(
      view,
      { allChannels: channels, fetchingStatus: OpenChannelListFetchingStatus.FETCHING },
      { renderChannelPreview },
    );

    expect(item()).toBeNull();
  });
});
