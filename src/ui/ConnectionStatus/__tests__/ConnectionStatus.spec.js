import React from 'react';
import renderer from 'react-test-renderer';

import ConnectionStatus from "../index";

describe('ConnectionStatus', () => {
  it('should render ConnectionStatus', function () {
    const component = renderer.create(
      <ConnectionStatus />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
