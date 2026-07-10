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
});
