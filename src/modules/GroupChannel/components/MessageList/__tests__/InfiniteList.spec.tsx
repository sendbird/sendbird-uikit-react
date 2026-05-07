import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { InfiniteList } from '../InfiniteList';

const setScrollMetrics = (
  element: HTMLElement,
  {
    scrollTop,
    scrollHeight,
    clientHeight,
  }: { scrollTop: number; scrollHeight: number; clientHeight: number },
) => {
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    writable: true,
    value: scrollTop,
  });
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
};

const renderList = (props = {}) => {
  const listRef = React.createRef<HTMLDivElement>();
  const defaultProps = {
    ref: listRef,
    messages: [
      { messageId: 1, createdAt: 1 },
      { messageId: 2, createdAt: 2 },
    ],
    renderMessage: ({ message }: any) => <div key={message.messageId}>message-{message.messageId}</div>,
    scrollPositionRef: { current: 0 },
    scrollDistanceFromBottomRef: { current: 0 },
    onLoadPrevious: jest.fn().mockResolvedValue(undefined),
    onLoadNext: jest.fn().mockResolvedValue(undefined),
    onScrollPosition: jest.fn(),
    ...props,
  };

  return {
    listRef,
    props: defaultProps,
    ...render(<InfiniteList {...(defaultProps as any)} />),
  };
};

describe('GroupChannel InfiniteList', () => {
  it('renders messages and typing indicator, then initializes at the bottom', () => {
    const { listRef } = renderList({
      typingIndicator: <div>typing</div>,
      initDeps: ['channel-url'],
    });
    const container = screen.getByTestId('sendbird-message-list-container');
    setScrollMetrics(container, { scrollTop: 0, scrollHeight: 500, clientHeight: 100 });

    expect(screen.getByText('message-1')).toBeInTheDocument();
    expect(screen.getByText('typing')).toBeInTheDocument();
    expect(listRef.current).toBe(container);
  });

  it('loads previous messages when the scroll reaches the top threshold', async () => {
    const scrollPositionRef = { current: 0 };
    const scrollDistanceFromBottomRef = { current: 0 };
    const onLoadPrevious = jest.fn().mockResolvedValue(undefined);
    const onScrollPosition = jest.fn();
    renderList({ scrollPositionRef, scrollDistanceFromBottomRef, onLoadPrevious, onScrollPosition });
    const container = screen.getByTestId('sendbird-message-list-container');
    setScrollMetrics(container, { scrollTop: 0, scrollHeight: 500, clientHeight: 100 });

    await act(async () => {
      fireEvent.scroll(container);
    });

    expect(onScrollPosition).toHaveBeenCalledWith('top');
    expect(scrollPositionRef.current).toBe(500);
    expect(scrollDistanceFromBottomRef.current).toBe(400);
    expect(onLoadPrevious).toHaveBeenCalled();
  });

  it('loads next messages when the scroll reaches the bottom threshold', async () => {
    const onLoadNext = jest.fn().mockResolvedValue(undefined);
    const onScrollPosition = jest.fn();
    renderList({ onLoadNext, onScrollPosition });
    const container = screen.getByTestId('sendbird-message-list-container');
    setScrollMetrics(container, { scrollTop: 400, scrollHeight: 500, clientHeight: 100 });

    await act(async () => {
      fireEvent.scroll(container);
    });

    expect(onScrollPosition).toHaveBeenCalledWith('bottom');
    expect(onLoadNext).toHaveBeenCalled();
  });

  it('reports middle scroll position without loading either direction', async () => {
    const onLoadPrevious = jest.fn().mockResolvedValue(undefined);
    const onLoadNext = jest.fn().mockResolvedValue(undefined);
    const onScrollPosition = jest.fn();
    renderList({ onLoadPrevious, onLoadNext, onScrollPosition });
    const container = screen.getByTestId('sendbird-message-list-container');
    setScrollMetrics(container, { scrollTop: 200, scrollHeight: 600, clientHeight: 100 });

    await act(async () => {
      fireEvent.scroll(container);
    });

    expect(onScrollPosition).toHaveBeenCalledWith('middle');
    expect(onLoadPrevious).not.toHaveBeenCalled();
    expect(onLoadNext).not.toHaveBeenCalled();
  });

  it('prevents overlapping fetches while a load is in progress', async () => {
    let resolveLoad: () => void = () => undefined;
    const onLoadPrevious = jest.fn(() => new Promise<void>((resolve) => {
      resolveLoad = resolve;
    }));
    renderList({ onLoadPrevious });
    const container = screen.getByTestId('sendbird-message-list-container');
    setScrollMetrics(container, { scrollTop: 0, scrollHeight: 500, clientHeight: 100 });

    fireEvent.scroll(container);
    fireEvent.scroll(container);
    expect(onLoadPrevious).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveLoad();
    });
  });
});
