import React from 'react';
import { render, screen } from '@testing-library/react';

import ChannelsPlaceholder from '../modules/ChannelList/components/Placeholder';
import Introduction from '../ui/Docs/Introduction';
import MobileMenu from '../ui/MobileMenu';
import { isVoiceMessage } from '../utils/isVoiceMessage';

jest.mock('../ui/MobileMenu/MobileBottomSheet', () => ({
  __esModule: true,
  default: () => <div data-testid="mobile-bottom-sheet" />,
}));

jest.mock('../ui/MobileMenu/MobileContextMenu', () => ({
  __esModule: true,
  default: () => <div data-testid="mobile-context-menu" />,
}));

jest.mock('../ui/PlaceHolder', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="placeholder">{props.type}</div>,
  PlaceHolderTypes: {
    LOADING: 'LOADING',
  },
}));

describe('tiny coverage targets', () => {
  it('renders simple docs and placeholder components', () => {
    render(
      <>
        <Introduction />
        <ChannelsPlaceholder type="LOADING" />
      </>,
    );

    expect(screen.getByText(/Storybook/)).toBeInTheDocument();
    expect(screen.getByTestId('placeholder')).toHaveTextContent('LOADING');
  });

  it('re-exports the voice message helper', () => {
    expect(isVoiceMessage({
      isFileMessage: () => true,
      type: 'audio/m4a;sbu_type=voice',
      metaArrays: [],
    } as any)).toBe(true);
  });

  it('selects the mobile menu variant by reaction setting', () => {
    const Menu = MobileMenu as any;
    const { rerender } = render(<Menu isReactionEnabled={false} />);
    expect(screen.getByTestId('mobile-context-menu')).toBeInTheDocument();

    rerender(<Menu isReactionEnabled />);
    expect(screen.getByTestId('mobile-bottom-sheet')).toBeInTheDocument();
  });
});
