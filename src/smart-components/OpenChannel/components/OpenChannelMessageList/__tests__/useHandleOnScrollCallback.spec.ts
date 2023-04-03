import { useHandleOnScrollCallback, calcScrollBottom } from '../useHandleOnScrollCallback';
import { renderHook } from '@testing-library/react'

const prepareMockEvent = ({
  scrollTop = 0,
  scrollHeight = 0,
  clientHeight = 0,
}) => {
  return {
    target: {
      scrollTop: scrollTop || 0,
      scrollHeight: scrollHeight || 0,
      clientHeight: clientHeight || 0,
    },
  } as unknown as React.UIEvent<HTMLDivElement, UIEvent>;
};

const prepareMockParams = () => {
  const onScroll = jest.fn((cb) => {
    cb();
  });
  const setShowScrollDownButton = jest.fn();
  const hasMore = true;
  const scrollRef = {
    current: {
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0
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
  it('should not execute if hasMore is false', () => {
    // prepare
    const params = prepareMockParams();
    params.hasMore = false;
    const event = prepareMockEvent({});

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll(event);

    // assert
    expect(params.onScroll).not.toHaveBeenCalled();
  });

  it('should not execute if scrollTop is greater than SCROLL_BUFFER', () => {
    // prepare
    const params = prepareMockParams();
    const event = prepareMockEvent({ scrollTop: 100 });

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll(event);

    // assert
    expect(params.onScroll).not.toHaveBeenCalled();
  });

  it('should execute if scrollTop is less than SCROLL_BUFFER', () => {
    // prepare
    const params = prepareMockParams();
    // @ts-ignore
    params.scrollRef.current.scrollHeight = 4459;
    const event = prepareMockEvent({
      clientHeight: 723,
      scrollHeight: 1174,
      scrollTop: 0
    });
    // @ts-ignore
    const scrollBottom = calcScrollBottom(event.target.scrollHeight, event.target.scrollTop);
    const newScrollHeight = params.scrollRef.current.scrollHeight - scrollBottom;

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll(event);

    // assert
    expect(params.onScroll).toHaveBeenCalled();
    expect(params.scrollRef.current.scrollTop).toEqual(newScrollHeight);
  });

  it('should call setShowScrollDownButton with true when scrollHeight is larger', () => {
    // prepare
    const params = prepareMockParams();
    const event = prepareMockEvent({ scrollHeight: 100, scrollTop: 5 });

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll(event);

    // assert
    expect(params.setShowScrollDownButton).toHaveBeenCalledWith(true);
  });

  it('should call setShowScrollDownButton with false when scrollHeight is shorter', () => {
    // prepare
    const params = prepareMockParams();
    const event = prepareMockEvent({ scrollHeight: 5, scrollTop: 100 });

    // call
    const { result } = renderHook(() => useHandleOnScrollCallback(params));
    const handleOnScroll = result.current;
    handleOnScroll(event);

    // assert
    expect(params.setShowScrollDownButton).toHaveBeenCalledWith(false);
  });
});
