import React from 'react';
import renderer from 'react-test-renderer';

import Checkbox from "../index";

describe('Checkbox', () => {
  it('should do a snapshot test of the default Checkbox DOM', function () {
    const component = renderer.create(
      <Checkbox />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should do a snapshot test of the checked Checkbox DOM', function () {
    const component = renderer.create(
      <Checkbox checked={true} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
