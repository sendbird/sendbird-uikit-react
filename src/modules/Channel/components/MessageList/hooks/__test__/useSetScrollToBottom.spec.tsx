import React from 'react';
import { render, fireEvent, renderHook } from '@testing-library/react';

import { useSetScrollToBottom } from '../useSetScrollToBottom';

jest.mock('../../../../../../hooks/useDebounce', () => ({
  useDebounce: (callback: () => void) => callback,
}));

const ScrollComponent = () => {
  const { scrollBottom, scrollToBottomHandler } = useSetScrollToBottom();

  return (
    <div style={{ height: '100px', overflowY: 'scroll' }} onScroll={scrollToBottomHandler}>
      {scrollBottom}
    </div>
  );
};

describe('Channel/useSetScrollToBottom ', () => {
  it('should set scrollBottom as zero on initial render', () => {
    const { result } = renderHook(() => {
      const myGreeting = useSetScrollToBottom();
      return myGreeting;
    }, {
      initialProps: { a: 'Alice', b: 'Bob' },
    });
    const { scrollBottom } = result.current;
    expect(scrollBottom).toBe(0);
  });

  it('should calculate correct value on scrollToBottom on execution', () => {
    const { container } = render(<ScrollComponent />);
    const scrollElement = container.firstChild as Element;

    // Initial state check
    expect(scrollElement.textContent).toBe('0');

    // Simulate scrolling
    Object.defineProperty(scrollElement, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(scrollElement, 'scrollTop', { get: () => 50 });
    Object.defineProperty(scrollElement, 'offsetHeight', { get: () => 30 });
    fireEvent.scroll(scrollElement);

    // Updated state check
    expect(scrollElement.textContent).toBe('20');
  });
});
