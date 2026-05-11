import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { MediaQueryProvider, useMediaQueryContext } from '../MediaQueryContext';

const MOBILE_CLASSNAME = 'sendbird--mobile-mode';

const Consumer = () => {
  const { breakpoint, isMobile } = useMediaQueryContext();
  return (
    <div>
      <span data-testid="is-mobile">{String(isMobile)}</span>
      <span data-testid="breakpoint">{String(breakpoint)}</span>
    </div>
  );
};

describe('MediaQueryContext', () => {
  afterEach(() => {
    document.body.classList.remove(MOBILE_CLASSNAME);
    jest.restoreAllMocks();
  });

  it('uses boolean breakpoints to force mobile mode and update the body class', () => {
    const { rerender } = render(
      <MediaQueryProvider breakpoint>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('true');
    expect(document.body).toHaveClass(MOBILE_CLASSNAME);

    rerender(
      <MediaQueryProvider breakpoint={false}>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('false');
    expect(document.body).not.toHaveClass(MOBILE_CLASSNAME);
  });

  it('uses string breakpoints through matchMedia and tracks resize changes', () => {
    const logger = {
      info: jest.fn(),
    };
    let matches = true;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { unmount } = render(
      <MediaQueryProvider breakpoint="600px" logger={logger as any}>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 600px)');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('breakpoint')).toHaveTextContent('600px');
    expect(document.body).toHaveClass(MOBILE_CLASSNAME);

    matches = false;
    act(() => {
      window.dispatchEvent(new window.Event('resize'));
    });

    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(document.body).not.toHaveClass(MOBILE_CLASSNAME);

    unmount();

    expect(logger.info).toHaveBeenCalledWith('MediaQueryProvider: removeEventListener', expect.any(Object));
  });
});
