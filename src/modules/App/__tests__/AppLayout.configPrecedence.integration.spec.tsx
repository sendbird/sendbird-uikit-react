import React from 'react';
import { render } from '@testing-library/react';
import { AppLayout } from '../AppLayout';
import { DesktopLayout } from '../DesktopLayout';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

// AppLayout resolves `props.X ?? dashboardConfig.X` and hands the result to the layout. Verify
// that App-level props win over the dashboard/global config, and fall back to it when absent.
vi.mock('../DesktopLayout', () => ({ DesktopLayout: vi.fn(() => null) }));
vi.mock('../MobileLayout', () => ({ MobileLayout: vi.fn(() => null) }));
vi.mock('../../../lib/MediaQueryContext', () => ({ useMediaQueryContext: vi.fn(() => ({ isMobile: false })) }));
vi.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));

const setGlobalConfig = (replyType: string, enableReactions: boolean, enableMessageSearch: boolean) => {
  vi.mocked(useSendbird).mockReturnValue({
    state: {
      config: {
        groupChannel: { replyType, enableReactions },
        groupChannelSettings: { enableMessageSearch },
      },
    },
  } as any);
};

const renderLayout = (extra: Record<string, unknown>) => render(
  <AppLayout {...({ isMessageGroupingEnabled: true, currentChannel: null, setCurrentChannel: vi.fn(), ...extra } as any)} />,
);

const lastDesktopProps = () => {
  const calls = vi.mocked(DesktopLayout).mock.calls;
  return calls[calls.length - 1][0];
};

describe('AppLayout — config precedence (App props over dashboard config)', () => {
  it('uses App-level props when provided (win over dashboard config)', () => {
    setGlobalConfig('NONE', true, true);
    renderLayout({ replyType: 'QUOTE_REPLY', isReactionEnabled: false, showSearchIcon: false });

    expect(lastDesktopProps()).toEqual(expect.objectContaining({
      replyType: 'QUOTE_REPLY',
      isReactionEnabled: false, // a `false` prop must NOT be overridden by the truthy config
      showSearchIcon: false,
    }));
  });

  it('falls back to the dashboard config when App props are absent', () => {
    setGlobalConfig('THREAD', true, true);
    renderLayout({});

    expect(lastDesktopProps()).toEqual(expect.objectContaining({
      replyType: 'THREAD', // resolved from config via getCaseResolvedReplyType
      isReactionEnabled: true,
      showSearchIcon: true,
    }));
  });
});
