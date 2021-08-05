import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import TextMessageItemBody from "../index";

describe('TextMessageItemBody', () => {
  it('should do a snapshot test of the TextMessageItemBody DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <TextMessageItemBody />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
