import React from 'react';
import { renderHook, screen, fireEvent, render, waitFor } from '@testing-library/react';
import useOutsideAlerter from '../useOutsideAlerter';

describe('useOutsideAlerter', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handle click outside correctly', async () => {
    const mockClickOutside = jest.fn();

    const targetComponent = <div id="target">inside</div>;
    render(targetComponent);

    const insideElement = screen.getByText('inside');
    const ref = {
      current: insideElement,
    };

    renderHook(() => useOutsideAlerter({
      ref,
      callback: mockClickOutside,
    }));

    fireEvent.mouseDown(insideElement);

    await waitFor(() => {
      expect(mockClickOutside).toHaveBeenCalledTimes(1);
    });
  });

});
