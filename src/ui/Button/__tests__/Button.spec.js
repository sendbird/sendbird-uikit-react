import React from 'react';
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer';

import Button, { ButtonSizes } from "../index";

describe('Button', () => {
  it('should do a snapshot test of the default Button DOM', function () {
    const component = renderer.create(
      <Button />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should do a snapshot test of the small Button DOM', function () {
    const component = renderer.create(
      <Button size={ButtonSizes.SMALL} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should contain className', function () {
    const text = 'example-text';
    const component = shallow(<Button className={text} />);
    expect(
      component.find(".sendbird-button").hasClass(text)
    ).toBe(true);
  });
});
