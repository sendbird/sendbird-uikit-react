import { render, waitFor, screen } from '@testing-library/react';
import useDidMountEffect from '../useDidMountEffect';
import React, { useState } from 'react';

describe('useDidMountEffect', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('ignore callback if didMount was false', () => {
    const mockCallback = jest.fn();

    const TestComponent = () => {
      const [counter, setCounter] = useState(0);
      useDidMountEffect(mockCallback, [counter]);
      return (<button onClick={() => setCounter(counter + 1)}>increment</button>);
    };

    render(<TestComponent />);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('call callback if didMount was true', async () => {
    const mockCallback = jest.fn();

    const TestComponent = () => {
      const [counter, setCounter] = useState(0);
      useDidMountEffect(mockCallback, [counter]);
      return (<button onClick={() => setCounter(counter + 1)}>increment</button>);
    };

    render(<TestComponent />);
    const button = screen.getByText('increment');

    await waitFor(() => {
      button.click();
    });

    await waitFor(() => {
      button.click();
    });

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });
});
