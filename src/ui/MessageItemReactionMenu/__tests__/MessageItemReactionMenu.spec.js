import React from 'react';
import renderer from 'react-test-renderer';

import MessageItemReactionMenu from "../index";

describe('MessageItemReactionMenu', () => {
  it('should do a snapshot test of the MessageItemReactionMenu DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <MessageItemReactionMenu
        message={{ sendingStatus: 'succeeded' }}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
