import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Tooltip from "../index";

describe('Tooltip', () => {
  it('should have className', function () {
    const className = "example-text";
    const text = 'Sravan S, Hoon Baek, Chong Bu, Mickey, Leo Shin, Doo Rim, Tez Park, Harry Kim, and you';
    const component = shallow(
      <Tooltip className={className}>
        {text}
      </Tooltip>
    );

    expect(
      component.find(".sendbird-tooltip").hasClass(className)
    ).toBe(true);
  });

  it('should do a snapshot test of the ReactedUsers DOM', function () {
    const className = "example-text";
    const text = 'Sravan S, Hoon Baek, Chong Bu, Mickey, Leo Shin, Doo Rim, Tez Park, Harry Kim, and you';
    const component = renderer.create(
      <Tooltip className={className}>
        {text}
      </Tooltip>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
