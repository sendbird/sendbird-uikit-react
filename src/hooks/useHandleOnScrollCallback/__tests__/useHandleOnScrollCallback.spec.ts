import { renderHook } from '@testing-library/react';
import { useHandleOnScrollCallback, calcScrollBottom } from '../index';

const prepareMockParams = ({
  scrollTop = 0,
  scrollHeight = 0,
  clientHeight = 0,
}) => {
  const onScroll = jest.fn((cb) => {
    cb();
  });
  const setShowScrollDownButton = jest.fn();
  const hasMore = true;
  const scrollRef = {
    current: {
      scrollTop,
      scrollHeight,
      clientHeight,
    },
  } as React.RefObject<HTMLDivElement>;
  return {
    onScroll,
    setShowScrollDownButton,
    hasMore,
    scrollRef,
  };
};

describe('useHandleOnScrollCallback', () => {
  it('should call setShowScrollDownButton with true when scrollHeight is larger', () => {
    // prepare
    const params = prepareMockParams({
      scrollHeight: 100, scrollTop: 5,
    });
    params.hasMore = false;

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll();

    // assert
    expect(params.setShowScrollDownButton).toHaveBeenCalledWith(true);
  });

  it('should call setShowScrollDownButton with false when scrollHeight is shorter', () => {
    // prepare
    const params = prepareMockParams({ scrollHeight: 5, scrollTop: 100 });

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll();

    // assert
    expect(params.setShowScrollDownButton).toHaveBeenCalledWith(false);
    expect(params.onScroll).not.toHaveBeenCalled();
  });

  it('should not call onScroll if hasMore is false', () => {
    // prepare
    const params = prepareMockParams({});
    params.hasMore = false;

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll();

    // assert
    expect(params.onScroll).not.toHaveBeenCalled();
  });

  it('should not execute onScroll if scrollTop is greater than SCROLL_BUFFER', () => {
    // prepare
    const params = prepareMockParams({ scrollTop: 100 });

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll();

    // assert
    expect(params.onScroll).not.toHaveBeenCalled();
  });

  it('should execute if scrollTop is less than SCROLL_BUFFER', () => {
    // prepare
    const params = prepareMockParams({
      clientHeight: 723,
      scrollHeight: 4459,
      scrollTop: 0,
    });
    const element = params.scrollRef.current;
    // @ts-ignore
    element.scrollHeight = 4459;
    // @ts-ignore
    const scrollBottom = calcScrollBottom(element.scrollHeight, element.scrollTop);
    const newScrollHeight = element.scrollHeight - scrollBottom;

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll();

    // assert
    expect(params.onScroll).toHaveBeenCalled();
    expect(element.scrollTop).toEqual(newScrollHeight);
  });
});
