import React from 'react';
import { render } from '@testing-library/react';

import Icon, { IconTypes } from "../index";

describe('ui/Icon', () => {
  it('should do a snapshot test of the defualt Icon DOM', function () {
    const { asFragment } = render(
      <Icon type={IconTypes.ADD} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
