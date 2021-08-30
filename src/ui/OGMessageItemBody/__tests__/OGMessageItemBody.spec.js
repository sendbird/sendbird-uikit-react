import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import OGMessageItemBody from "../index";

describe('OGMessageItemBody', () => {
  it('should do a snapshot test of the OGMessageItemBody DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <OGMessageItemBody />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
