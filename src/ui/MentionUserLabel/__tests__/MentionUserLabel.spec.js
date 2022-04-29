import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import MentionUserLabel from "../index";

describe('MentionUserLabel', () => {
  it('should do a snapshot test of the MentionUserLabel DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <MentionUserLabel />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
