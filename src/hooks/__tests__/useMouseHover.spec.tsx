import React from 'react';
import { renderHook, screen, fireEvent, render, waitFor } from '@testing-library/react';
import useMouseHover from '../useMouseHover';

describe('useMouseHover', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handle mouse over and out correctly', async () => {
    const mockSetHover = jest.fn();

    const targetComponent = <div id="target">hover</div>;
    render(targetComponent);

    const hoverElement = screen.getByText('hover');
    const ref = {
      current: hoverElement,
    };

    renderHook(() => useMouseHover({
      ref,
      setHover: mockSetHover,
    }));

    fireEvent.mouseEnter(hoverElement);
    fireEvent.mouseLeave(hoverElement);

    await waitFor(() => {
      expect(mockSetHover).toHaveBeenCalledTimes(2);
      expect(mockSetHover).toHaveBeenCalledWith(true);
      expect(mockSetHover).toHaveBeenCalledWith(false);
    });
  });

});
