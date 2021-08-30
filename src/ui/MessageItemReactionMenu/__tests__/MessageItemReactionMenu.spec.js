import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import MessageItemReactionMenu from "../index";

describe('MessageItemReactionMenu', () => {
  it('should do a snapshot test of the MessageItemReactionMenu DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <MessageItemReactionMenu />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
