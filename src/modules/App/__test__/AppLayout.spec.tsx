import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const mockUseSendbird = jest.fn();
const mockUseMediaQueryContext = jest.fn();
const mockDesktopLayout = jest.fn((props) => (
  <div data-testid="desktop-layout">
    {props.replyType}
  </div>
));
const mockMobileLayout = jest.fn((props) => (
  <div data-testid="mobile-layout">
    {props.replyType}
  </div>
));

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => mockUseSendbird(),
}));

jest.mock('../../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: () => mockUseMediaQueryContext(),
}));

jest.mock('../DesktopLayout', () => ({
  DesktopLayout: (props) => mockDesktopLayout(props),
}));

jest.mock('../MobileLayout', () => ({
  MobileLayout: (props) => mockMobileLayout(props),
}));

import { AppLayout } from '../AppLayout';

describe('AppLayout', () => {
  const baseProps = {
    isMessageGroupingEnabled: true,
    autoscrollMessageOverflowToTop: false,
    allowProfileEdit: false,
    disableAutoSelect: false,
    currentChannel: undefined,
    setCurrentChannel: jest.fn(),
    enableLegacyChannelModules: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSendbird.mockReturnValue({
      state: {
        config: {
          groupChannel: {
            replyType: 'thread',
            enableReactions: false,
          },
          groupChannelSettings: {
            enableMessageSearch: true,
          },
        },
      },
    });
  });

  it('renders DesktopLayout and resolves provider config fallbacks', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: false, breakpoint: false });

    render(<AppLayout {...baseProps} />);

    expect(screen.getByTestId('desktop-layout')).toHaveTextContent('THREAD');
    expect(mockDesktopLayout).toHaveBeenCalledWith(expect.objectContaining({
      replyType: 'THREAD',
      isReactionEnabled: false,
      showSearchIcon: true,
      currentChannel: undefined,
      setCurrentChannel: baseProps.setCurrentChannel,
    }));
    expect(mockMobileLayout).not.toHaveBeenCalled();
  });

  it('renders MobileLayout when the media query context is mobile', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true, breakpoint: true });

    render(<AppLayout {...baseProps} replyType="QUOTE_REPLY" isReactionEnabled showSearchIcon={false} />);

    expect(screen.getByTestId('mobile-layout')).toHaveTextContent('QUOTE_REPLY');
    expect(mockMobileLayout).toHaveBeenCalledWith(expect.objectContaining({
      replyType: 'QUOTE_REPLY',
      isReactionEnabled: true,
      showSearchIcon: false,
    }));
    expect(mockDesktopLayout).not.toHaveBeenCalled();
  });
});
