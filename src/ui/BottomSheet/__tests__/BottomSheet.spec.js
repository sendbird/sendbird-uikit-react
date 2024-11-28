import React from 'react';
import { render } from '@testing-library/react';

import BottomSheet from "../index";
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';

describe('ui/BottomSheet', () => {
  it('should do a snapshot test of the default Button DOM', function () {
    render(
      <SendbirdContext.Provider value={{}}>
        <BottomSheet className='test_classname' />
      </SendbirdContext.Provider>
    );
    expect(document.body.lastChild).toMatchSnapshot();
  });
});
