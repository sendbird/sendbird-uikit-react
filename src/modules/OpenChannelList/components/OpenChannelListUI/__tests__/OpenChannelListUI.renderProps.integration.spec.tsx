import React from 'react';
import { render } from '@testing-library/react';
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

    renderUI({}, { renderHeader });

    expect(renderHeader).toHaveBeenCalled();
  });
});
