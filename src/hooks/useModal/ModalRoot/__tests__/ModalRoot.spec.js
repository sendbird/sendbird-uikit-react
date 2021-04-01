import React from 'react';
import { shallow } from 'enzyme';

import ModalRoot from '../index';

describe('ModalRoot', () => {
  it('should have expected id', function () {
    const component = shallow(<ModalRoot />);
    expect(component.prop('id')).toEqual('sendbird-modal-root');
  });
});
