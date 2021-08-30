import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import UnknownMessageItemBody from "../index";

describe('UnknownMessageItemBody', () => {
  it('should do a snapshot test of the UnknownMessageItemBody DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <UnknownMessageItemBody />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
