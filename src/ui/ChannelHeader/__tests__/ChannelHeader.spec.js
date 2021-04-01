import React from 'react';
import renderer from 'react-test-renderer';

import ChannelHeader from '../index.jsx';

const noop = () => { };

describe('ChannelHeader', () => {
  it('should create a snapshot of a default ChannelHeader component', function () {
    const component = renderer.create(
      <ChannelHeader onEdit={noop} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
