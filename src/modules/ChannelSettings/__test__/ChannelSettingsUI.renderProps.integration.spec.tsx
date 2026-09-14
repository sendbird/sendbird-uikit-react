import React from 'react';
import { render } from '@testing-library/react';
import ChannelSettingsUI from '../components/ChannelSettingsUI';
import useChannelSettings from '../context/useChannelSettings';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../lib/LocalizationContext';
import useMenuItems from '../components/ChannelSettingsUI/hooks/useMenuItems';

// The existing OperatorList test covers one leaf render prop. This covers the settings panel's own
// render props: renderHeader / renderChannelProfile / renderModerationPanel / renderLeaveChannel
// are invoked with the expected args when the customer supplies them.
vi.mock('../context/useChannelSettings', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../../lib/LocalizationContext', async () => ({
  ...(await vi.importActual('../../../lib/LocalizationContext')),
  useLocalization: vi.fn(),
}));
vi.mock('../components/ChannelSettingsUI/hooks/useMenuItems', () => ({ __esModule: true, default: vi.fn(() => []) }));

const channel = { url: 'ch-1' };

describe('ChannelSettingsUI — render-prop propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSendbird).mockReturnValue({ state: { config: { isOnline: true } } } as any);
    vi.mocked(useChannelSettings).mockReturnValue({
      state: { channel, invalidChannel: false, onCloseClick: vi.fn(), loading: false },
    } as any);
    vi.mocked(useLocalization).mockReturnValue({ stringSet: { CHANNEL_SETTING__LEAVE_CHANNEL__TITLE: 'Leave' } } as any);
    // Distinctive value so the assertion proves the menuItems came from useMenuItems() (not any defined value).
    vi.mocked(useMenuItems).mockReturnValue([{ id: 'menu-x' }] as any);
  });

  it('invokes each customer render prop with the expected args', () => {
    const renderHeader = vi.fn(() => <div />);
    const renderChannelProfile = vi.fn(() => <div />);
    const renderModerationPanel = vi.fn(() => <div />);
    const renderLeaveChannel = vi.fn(() => <div />); // provided so the default leave menu is not rendered

    render(
      <ChannelSettingsUI
        renderHeader={renderHeader as any}
        renderChannelProfile={renderChannelProfile}
        renderModerationPanel={renderModerationPanel as any}
        renderLeaveChannel={renderLeaveChannel}
      />,
    );

    // renderHeader is invoked with the header props ({ onCloseClick })
    expect(renderHeader).toHaveBeenCalledWith(expect.objectContaining({ onCloseClick: expect.any(Function) }));
    expect(renderChannelProfile).toHaveBeenCalled();
    // renderModerationPanel is invoked with the exact menuItems computed by useMenuItems()
    expect(renderModerationPanel).toHaveBeenCalledWith(expect.objectContaining({ menuItems: [{ id: 'menu-x' }] }));
    expect(renderLeaveChannel).toHaveBeenCalled();
  });

  it('renders only the loading placeholder while the settings are loading', () => {
    vi.mocked(useChannelSettings).mockReturnValue({
      state: { channel, invalidChannel: false, onCloseClick: vi.fn(), loading: true },
    } as any);
    const renderPlaceholderLoading = vi.fn(() => <div data-testid="loading" />);
    const renderChannelProfile = vi.fn(() => <div />);

    const { getByTestId } = render(
      <ChannelSettingsUI
        renderPlaceholderLoading={renderPlaceholderLoading as any}
        renderChannelProfile={renderChannelProfile as any}
      />,
    );

    expect(getByTestId('loading')).toBeTruthy();
    expect(renderChannelProfile).not.toHaveBeenCalled();
  });

  it('keeps the header but drops the panel when the channel is invalid', () => {
    vi.mocked(useChannelSettings).mockReturnValue({
      state: { channel: null, invalidChannel: true, onCloseClick: vi.fn(), loading: false },
    } as any);
    const renderHeader = vi.fn(() => <div data-testid="header" />);
    const renderPlaceholderError = vi.fn(() => <div data-testid="error" />);
    const renderChannelProfile = vi.fn(() => <div />);

    const { getByTestId } = render(
      <ChannelSettingsUI
        renderHeader={renderHeader as any}
        renderPlaceholderError={renderPlaceholderError as any}
        renderChannelProfile={renderChannelProfile as any}
      />,
    );

    expect(getByTestId('header')).toBeTruthy();
    expect(getByTestId('error')).toBeTruthy();
    expect(renderChannelProfile).not.toHaveBeenCalled();
  });

  it('disables the default leave-channel item while offline', () => {
    vi.mocked(useSendbird).mockReturnValue({ state: { config: { isOnline: false } } } as any);

    const { container } = render(
      <ChannelSettingsUI
        renderHeader={(() => <div />) as any}
        renderModerationPanel={(() => <div />) as any}
      />,
    );

    const leave = container.querySelector('.sendbird-channel-settings__panel-item__leave-channel');
    expect(leave).toBeTruthy();
    expect(leave!.className).toContain('sendbird-channel-settings__panel-item__disabled');
  });
});
