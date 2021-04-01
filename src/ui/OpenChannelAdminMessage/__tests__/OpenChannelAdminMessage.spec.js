import React from 'react';
import renderer from 'react-test-renderer';

import OpenChannelAdminMessage from "../index";

describe('OpenChannelAdminMessage', () => {
  it('should do a snapshot test of the OpenChannelAdminMessage DOM', function() {
    const component = renderer.create(
      <OpenChannelAdminMessage
        message={{ message: 'Hello I am Admin' }}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
