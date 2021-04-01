import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import IconButton from "../index";

import DefaultIcon from '../../../svgs/icon-create.svg';

describe('IconButton', () => {
  it('should do a snapshot test of the icon button DOM', function () {
    const text = "example-text";
    const component = renderer.create(
      <IconButton>
        <DefaultIcon />
      </IconButton>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
