import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import MaterialMessageItemBody from "../index";

describe('MaterialMessageItemBody', () => {
  it('should do a snapshot test of the MaterialMessageItemBody DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <MaterialMessageItemBody />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
