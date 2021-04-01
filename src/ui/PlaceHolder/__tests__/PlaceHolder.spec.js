import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import PlaceHolder from "../index";
import PlaceHolderTypes from '../type';

describe('PlaceHolder', () => {
  it('should should contain className', function () {
    const text = "example-text";
    const component = shallow(<PlaceHolder className={text} type={PlaceHolderTypes.WRONG} />);

    expect(
      component.find(".sendbird-place-holder").hasClass(text)
    ).toBe(true);
  });

  it('should do a snapshot test of the PlaceHolder DOM', function () {
    const text = "example-text";
    const component = renderer.create(
      <PlaceHolder className={text} type={PlaceHolderTypes.WRONG} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
