import React from 'react';
import { render } from '@testing-library/react';

import IconButton from "../index";

import DefaultIcon from '../../../svgs/icon-create.svg';

describe('ui/IconButton', () => {
  it('should do a snapshot test of the icon button DOM', function () {
    const { asFragment } = render(
      <IconButton>
        <DefaultIcon />
      </IconButton>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
