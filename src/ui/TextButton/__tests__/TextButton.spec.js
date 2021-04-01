import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import TextButton from "../index";

describe('TextButton', () => {
  it('should contain the className', function () {
    const className = "example-classname";
    const component = shallow(<TextButton className={className}>Textbutton</TextButton>);

    expect(
      component.find('.sendbird-textbutton').hasClass(className)
    ).toBe(true);
  });

  it('should do a snapshot test of the TextButton DOM', function () {
    const component = renderer.create(
      <TextButton>Textbutton</TextButton>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
