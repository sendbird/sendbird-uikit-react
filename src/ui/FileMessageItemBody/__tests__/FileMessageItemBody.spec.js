import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import FileMessageItemBody from "../index";

describe('FileMessageItemBody', () => {
  it('should do a snapshot test of the FileMessageItemBody DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <FileMessageItemBody />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
