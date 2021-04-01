import React from 'react';
import renderer from 'react-test-renderer';

import Icon, { IconTypes } from "../index";

describe('Icon', () => {
  it('should do a snapshot test of the defualt Icon DOM', function () {
    const component = renderer.create(
      <Icon type={IconTypes.ADD} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
