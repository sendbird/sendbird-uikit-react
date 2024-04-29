import React from 'react';
import { render } from '@testing-library/react';

import BottomSheet from "../index";
import { SendbirdSdkContext } from '../../../lib/SendbirdSdkContext';

describe('ui/BottomSheet', () => {
  it('should do a snapshot test of the default Button DOM', function () {
    render(
      <SendbirdSdkContext.Provider value={{}}>
        <BottomSheet className='test_classname' />
      </SendbirdSdkContext.Provider>
    );
    expect(document.body.lastChild).toMatchSnapshot();
  });
});
