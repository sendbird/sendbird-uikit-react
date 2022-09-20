import React from 'react';
import { render } from '@testing-library/react';

import ConnectionStatus from "../index";

describe('ui/ConnectionStatus', () => {
  it('should render ConnectionStatus', function () {
    const { asFragment } = render(
      <ConnectionStatus />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
