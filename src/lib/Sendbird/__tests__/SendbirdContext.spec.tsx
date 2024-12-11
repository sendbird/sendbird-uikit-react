import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { SendbirdContext, createSendbirdContextStore } from '../context/SendbirdContext';

describe('SendbirdContext', () => {
  it('should initialize with null by default', () => {
    const TestComponent = () => {
      const context = useContext(SendbirdContext);
      return <div>{context ? 'Not Null' : 'Null'}</div>;
    };

    const { getByText } = render(<TestComponent />);
    expect(getByText('Null')).toBeInTheDocument();
  });

  it('should provide a valid context to child components', () => {
    const mockStore = createSendbirdContextStore();
    const TestComponent = () => {
      const context = useContext(SendbirdContext);
      return <div>{context ? 'Not Null' : 'Null'}</div>;
    };

    const { getByText } = render(
      <SendbirdContext.Provider value={mockStore}>
        <TestComponent />
      </SendbirdContext.Provider>,
    );

    expect(getByText('Not Null')).toBeInTheDocument();
  });
});
