import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Carousel from '../index';

const mockUseMediaQueryContext = jest.fn();

jest.mock('../../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: () => mockUseMediaQueryContext(),
}));

const TemplateItem = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const createItem = (label: string, width: number | 'fill') => React.createElement(
  TemplateItem,
  {
    templateItems: [{
      width: width === 'fill'
        ? { type: 'flex', value: 1 }
        : { type: 'fixed', value: width },
    }],
  } as any,
  label,
);

describe('Carousel', () => {
  beforeEach(() => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: false });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 240 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 120 });
    document.body.innerHTML = '<div class="sendbird-conversation__messages-padding"></div>';
  });

  it('renders fixed and flexible items with desktop drag navigation', () => {
    const { container } = render(
      <Carousel
        id="desktop-carousel"
        items={[
          createItem('First', 80),
          createItem('Second', 'fill'),
          createItem('Third', 60),
        ]}
      />,
    );
    const carousel = container.querySelector('#desktop-carousel');
    const wrapper = container.querySelector('.sendbird-carousel-items-wrapper') as HTMLElement;

    expect(carousel).toHaveStyle({ cursor: 'grab' });
    expect(wrapper.children).toHaveLength(3);
    expect((wrapper.children[0] as HTMLElement).style.minWidth).toBe('');
    expect((wrapper.children[1] as HTMLElement).style.minWidth).toBe('0px');

    fireEvent.mouseDown(carousel, { clientX: 100 });
    expect(carousel).toHaveStyle({ cursor: 'grabbing' });
    fireEvent.mouseMove(carousel, { clientX: 40 });
    fireEvent.mouseUp(carousel);
    expect(wrapper.style.transform).toBe('translateX(-88px)');

    fireEvent.mouseDown(carousel, { clientX: 40 });
    fireEvent.mouseMove(carousel, { clientX: 100 });
    fireEvent.mouseLeave(carousel);
    expect(wrapper.style.transform).toBe('translateX(0px)');
  });

  it('ignores desktop mouse movement before dragging and below the swipe threshold', () => {
    const { container } = render(
      <Carousel id="small-drag-carousel" items={[createItem('First', 80), createItem('Second', 80)]} />,
    );
    const carousel = container.querySelector('#small-drag-carousel');
    const wrapper = container.querySelector('.sendbird-carousel-items-wrapper') as HTMLElement;

    fireEvent.mouseMove(carousel, { clientX: 40 });
    expect(wrapper.style.transform).toBe('translateX(0px)');

    fireEvent.mouseDown(carousel, { clientX: 100 });
    fireEvent.mouseMove(carousel, { clientX: 80 });
    fireEvent.mouseUp(carousel);
    expect(wrapper.style.transform).toBe('translateX(0px)');
  });

  it('handles mobile horizontal swipes and restores parent scroll', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 170 });
    const { container } = render(
      <Carousel id="mobile-carousel" items={[createItem('First', 80), createItem('More', 40)]} />,
    );
    const carousel = container.querySelector('#mobile-carousel');
    const wrapper = container.querySelector('.sendbird-carousel-items-wrapper') as HTMLElement;
    const parent = document.querySelector('.sendbird-conversation__messages-padding') as HTMLElement;

    fireEvent.touchStart(carousel, { touches: [{ clientX: 120, clientY: 0 }] });
    fireEvent.touchMove(carousel, { touches: [{ clientX: 40, clientY: 0 }] });
    expect(parent.style.overflowY).toBe('hidden');
    fireEvent.touchEnd(carousel);

    expect(parent.style.overflowY).toBe('scroll');
    expect(wrapper.style.transform).toBe('translateX(-22px)');
  });

  it('tracks vertical mobile gestures without locking parent scroll', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true });
    const { container } = render(
      <Carousel id="vertical-carousel" items={[createItem('First', 80), createItem('Second', 80)]} />,
    );
    const carousel = container.querySelector('#vertical-carousel');
    const parent = document.querySelector('.sendbird-conversation__messages-padding') as HTMLElement;

    fireEvent.touchStart(carousel, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(carousel, {
      touches: [
        { clientX: 100, clientY: 0 },
        { clientX: 102, clientY: 100 },
      ],
    });
    fireEvent.touchEnd(carousel);

    expect(parent.style.overflowY).toBe('scroll');
  });

  it('handles mobile swipes for wide last items and swiping back', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true });
    const { container } = render(
      <Carousel id="wide-mobile-carousel" items={[createItem('First', 80), createItem('Second', 120)]} />,
    );
    const carousel = container.querySelector('#wide-mobile-carousel');
    const wrapper = container.querySelector('.sendbird-carousel-items-wrapper') as HTMLElement;

    fireEvent.touchStart(carousel, { touches: [{ clientX: 120, clientY: 0 }] });
    fireEvent.touchMove(carousel, { touches: [{ clientX: 40, clientY: 0 }] });
    fireEvent.touchEnd(carousel);
    expect(wrapper.style.transform).toBe('translateX(-88px)');

    fireEvent.touchStart(carousel, { touches: [{ clientX: 40, clientY: 0 }] });
    fireEvent.touchMove(carousel, { touches: [{ clientX: 120, clientY: 0 }] });
    fireEvent.touchEnd(carousel);
    expect(wrapper.style.transform).toBe('translateX(0px)');
  });

  it('snaps to the next item before a narrow final item on mobile', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 300 });
    const { container } = render(
      <Carousel id="fit-mobile-carousel" items={[createItem('First', 80), createItem('Second', 80), createItem('More', 40)]} />,
    );
    const carousel = container.querySelector('#fit-mobile-carousel');
    const wrapper = container.querySelector('.sendbird-carousel-items-wrapper') as HTMLElement;

    fireEvent.touchStart(carousel, { touches: [{ clientX: 120, clientY: 0 }] });
    fireEvent.touchMove(carousel, { touches: [{ clientX: 40, clientY: 0 }] });
    fireEvent.touchEnd(carousel);

    expect(wrapper.style.transform).toBe('translateX(-88px)');
  });

  it('snaps to the next item when a narrow final item still does not fit on mobile', () => {
    mockUseMediaQueryContext.mockReturnValue({ isMobile: true });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 150 });
    const { container } = render(
      <Carousel id="not-fit-mobile-carousel" items={[createItem('First', 80), createItem('Second', 80), createItem('More', 40)]} />,
    );
    const carousel = container.querySelector('#not-fit-mobile-carousel');
    const wrapper = container.querySelector('.sendbird-carousel-items-wrapper') as HTMLElement;

    fireEvent.touchStart(carousel, { touches: [{ clientX: 120, clientY: 0 }] });
    fireEvent.touchMove(carousel, { touches: [{ clientX: 40, clientY: 0 }] });
    fireEvent.touchEnd(carousel);

    expect(wrapper.style.transform).toBe('translateX(-88px)');
  });
});
