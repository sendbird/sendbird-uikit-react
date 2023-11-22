import React from 'react';
import { renderHook } from '@testing-library/react';
import { useOnScrollPositionChangeDetector, UseOnScrollReachedEndDetectorProps } from '../index';
import { SCROLL_BUFFER } from '../../../utils/consts';

jest.useFakeTimers();

const SAFE_DELAY = 550;

const prepareMockParams = (): UseOnScrollReachedEndDetectorProps => {
  return {
    onReachedTop: jest.fn(),
    onReachedBottom: jest.fn(),
    onInBetween: jest.fn(),
  };
};

const getMockScrollEvent = ({
  scrollTop = 0,
  scrollHeight = 0,
  clientHeight = 0,
}): React.UIEvent<HTMLDivElement> => {
  return {
    target: {
      scrollTop,
      scrollHeight,
      clientHeight,
    },
  } as unknown as React.UIEvent<HTMLDivElement>;
};

describe('useOnScrollReachedEndDetector', () => {
  it('should call onReachedTop() when scrollTop is SCROLL_BUFFER', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: SCROLL_BUFFER,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).toHaveBeenCalledTimes(1);
    expect(params.onReachedBottom).not.toHaveBeenCalled();
    expect(params.onInBetween).not.toHaveBeenCalled();
  });
  it('should call onReachedTop() when scrollTop < SCROLL_BUFFER', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: 5,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).toHaveBeenCalledTimes(1);
    expect(params.onReachedBottom).not.toHaveBeenCalled();
    expect(params.onInBetween).not.toHaveBeenCalled();
  });
  it('should call onReachedTop() when scrollTop is 0', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: 0,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).toHaveBeenCalledTimes(1);
    expect(params.onReachedBottom).not.toHaveBeenCalled();
    expect(params.onInBetween).not.toHaveBeenCalled();
  });
  it('should call onReachedBottom() when scrollHeight - (clientHeight + scrollTop) is SCROLL_BUFFER', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: 90,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).toHaveBeenCalledTimes(1);
    expect(params.onInBetween).not.toHaveBeenCalled();
  });
  it('should call onReachedBottom() when scrollHeight - (clientHeight + scrollTop) < SCROLL_BUFFER', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: 95,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).toHaveBeenCalledTimes(1);
    expect(params.onInBetween).not.toHaveBeenCalled();
  });
  it('should call onReachedBottom() when scrollHeight - (clientHeight + scrollTop) is 0', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: 100,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).toHaveBeenCalledTimes(1);
    expect(params.onInBetween).not.toHaveBeenCalled();
  });
  it('should call onReachedBottom() when scroll position has not reached either ends', () => {
    const params = prepareMockParams();

    const { result } = renderHook(() => useOnScrollPositionChangeDetector(params));
    const onScrollReachedEndDetector = result.current;
    onScrollReachedEndDetector(getMockScrollEvent({
      scrollTop: 50,
      clientHeight: 100,
      scrollHeight: 200,
    }));

    jest.advanceTimersByTime(SAFE_DELAY);

    expect(params.onReachedTop).not.toHaveBeenCalled();
    expect(params.onReachedBottom).not.toHaveBeenCalled();
    expect(params.onInBetween).toHaveBeenCalledTimes(1);
  });
});
