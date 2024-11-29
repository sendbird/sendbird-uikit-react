import React from 'react';
import { render, renderHook } from '@testing-library/react';

import BottomSheet from "../index";
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
  useSendbird: jest.fn(),
}));


describe('ui/BottomSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const stateContextValue = {
      state: {
        config: {},
        stores: {},
      },
    };
    useSendbird.mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('should do a snapshot test of the default Button DOM', function () {
    render(
      <SendbirdContext.Provider value={{}}>
        <BottomSheet className='test_classname' />
      </SendbirdContext.Provider>
    );
    expect(document.body.lastChild).toMatchSnapshot();
  });
});
