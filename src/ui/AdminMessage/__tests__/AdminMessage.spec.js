import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import AdminMessage from "../index";
import dummyAdminMessage from '../adminMessageDummyData.mock';

describe('AdminMessage', () => {
  it('should contain className', function () {
    const text = "example-classname";
    const component = shallow(<AdminMessage className={text} message={dummyAdminMessage} />);
    expect(
      component.find('.sendbird-admin-message').hasClass(text)
    ).toBe(true);
  });

  it('should do a snapshot test of the AdminMessage DOM', function () {
    const text = "example-classname";
    const component = renderer.create(
      <AdminMessage className={text} message={dummyAdminMessage} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
