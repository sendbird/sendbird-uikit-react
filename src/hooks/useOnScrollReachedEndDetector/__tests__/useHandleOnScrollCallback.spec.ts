import React from 'react';
import { renderHook } from '@testing-library/react';
import { useOnScrollReachedEndDetector, UseOnScrollReachedEndDetectorProps } from '../index';
import { SCROLL_BUFFER } from '../../../utils/consts';

jest.useFakeTimers();

const SAFE_DELAY = 550;

const prepareMockParams = ({
  scrollTop = 0,
  scrollHeight = 0,
  clientHeight = 0,
}): UseOnScrollReachedEndDetectorProps => {
  const scrollRef = {
    current: {
      scrollTop,
      scrollHeight,
      clientHeight,
    },
  } as React.RefObject<HTMLDivElement>;
  return {
    scrollRef,
    onReachedTop: jest.fn(),
    onReachedBottom: jest.fn(),
  };
};

describe('useOnScrollReachedEndDetector', () => {
  it('should call onReachedTop() when scrollTop is SCROLL_BUFFER', () => {
    const params = prepareMockParams({
      scrollTop: SCROLL_BUFFER,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).toHaveBeenCalledTimes(1);
    expect(params.onReachedBottom).not.toHaveBeenCalled();
  });
  it('should call onReachedTop() when scrollTop < SCROLL_BUFFER', () => {
    const params = prepareMockParams({
      scrollTop: 5,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).toHaveBeenCalledTimes(1);
    expect(params.onReachedBottom).not.toHaveBeenCalled();
  });
  it('should call onReachedTop() when scrollTop is 0', () => {
    const params = prepareMockParams({
      scrollTop: 0,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).toHaveBeenCalledTimes(1);
    expect(params.onReachedBottom).not.toHaveBeenCalled();
  });
  it('should call onReachedBottom() when scrollHeight - (clientHeight + scrollTop) is SCROLL_BUFFER', () => {
    const params = prepareMockParams({
      scrollTop: 90,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).toHaveBeenCalledTimes(1);
  });
  it('should call onReachedBottom() when scrollHeight - (clientHeight + scrollTop) < SCROLL_BUFFER', () => {
    const params = prepareMockParams({
      scrollTop: 95,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).toHaveBeenCalledTimes(1);
  });
  it('should call onReachedBottom() when scrollHeight - (clientHeight + scrollTop) is 0', () => {
    const params = prepareMockParams({
      scrollTop: 100,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).toHaveBeenCalledTimes(1);
  });
  it('should call onReachedBottom() when scroll position has not reached either ends', () => {
    const params = prepareMockParams({
      scrollTop: 50,
      clientHeight: 100,
      scrollHeight: 200,
    });

    const { result } = renderHook(() => useOnScrollReachedEndDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector();

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).not.toHaveBeenCalled();
  });
});
