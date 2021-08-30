import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import OpenChannelMessageContent from "../index";

describe('OpenChannelMessageContent', () => {
  it('should do a snapshot test of the OpenChannelMessageContent DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <OpenChannelMessageContent />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
