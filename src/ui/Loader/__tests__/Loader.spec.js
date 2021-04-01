import React from 'react';
import renderer from 'react-test-renderer';

import Loader from "../index";

describe('Loader', () => {
  it('should do a snapshot test of the default Loader DOM', function () {
    const component = renderer.create(
      <Loader />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
