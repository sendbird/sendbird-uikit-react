import React from 'react';
import { act, renderHook, screen, fireEvent, render, waitFor } from '@testing-library/react';
import useLongPress from '../useLongPress';

describe('useLongPress', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handle long press correctly', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnClick = jest.fn();

    const { result } = renderHook(() => useLongPress({
      onLongPress: mockOnLongPress,
      onClick: mockOnClick,
    }));
    const { onTouchStart, onTouchEnd } = result.current;

    const targetComponent = <div id="target" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>touch this</div>;
    render(targetComponent);

    const element = screen.getByText('touch this');
    fireEvent.touchStart(element);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    fireEvent.touchEnd(element);

    await waitFor(() => {
      expect(mockOnLongPress).toHaveBeenCalled();
    });
  });

  it('cancel long press if touch is too short', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnClick = jest.fn();

    const { result } = renderHook(() => useLongPress({
      onLongPress: mockOnLongPress,
      onClick: mockOnClick,
    }));
    const { onTouchStart, onTouchEnd } = result.current;

    const targetComponent = <div id="target" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>touch this</div>;
    render(targetComponent);

    const element = screen.getByText('touch this');
    fireEvent.touchStart(element);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    fireEvent.touchEnd(element);

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalled();
      expect(mockOnLongPress).not.toHaveBeenCalled();
    });
  });

});
