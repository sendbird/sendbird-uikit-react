import React from 'react';
import { render, screen } from '@testing-library/react';

import BottomSheet from "../index";

describe('ui/BottomSheet', () => {
  it('should do a snapshot test of the default Button DOM', function () {
    render(<BottomSheet className='test_classname' />);
    expect(document.body.lastChild).toMatchSnapshot();
  });
});
