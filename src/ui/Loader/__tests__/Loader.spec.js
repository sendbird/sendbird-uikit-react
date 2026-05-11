import React from 'react';
import { render } from '@testing-library/react';

import Loader from '../index';

describe('ui/Loader', () => {
  it('should do a snapshot test of the default Loader DOM', () => {
    const { asFragment } = render(
      <Loader />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('uses the primary theme color for the default spinner', () => {
    const { container } = render(<Loader />);

    expect(container.querySelector('.sendbird-icon-spinner')).toHaveClass('sendbird-icon-color--primary');
  });
});
