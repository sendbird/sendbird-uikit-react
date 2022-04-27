import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import Word from "../index";

describe('Word', () => {
  it('should do a snapshot test of the Word DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <Word
        word="hello@{hoon}"
        message={{
          mentionedUsers: [{ userId: 'hoon', nickname: 'Hoon Baek' }]
        }}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
