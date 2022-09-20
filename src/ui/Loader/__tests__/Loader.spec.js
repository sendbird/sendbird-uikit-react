import React from 'react';
import { render } from '@testing-library/react';

import Loader from "../index";

describe('ui/Loader', () => {
  it('should do a snapshot test of the default Loader DOM', function () {
    const { asFragment } = render(
      <Loader />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
