import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Badge from "../index";

describe('Badge', () => {
  it('should do a snapshot test of the Badge DOM', function () {
    const count = 1;
    const component = renderer.create(
      <Badge count={count} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display maximum number as a maxLevel: 1', function () {
    const count = 10;
    const level = 1;

    const component = mount(
      <Badge count={count} maxLevel={level} />
    );
    expect(
      component.find('.sendbird-label').text()
    ).toEqual('9+');
  });

  it('should display maximum number as a maxLevel: 2 (default level)', function () {
    const count = 100;

    const component = mount(
      <Badge count={count} />
    );
    expect(
      component.find('.sendbird-label').text()
    ).toEqual('99+');
  });

  it('should display maximum number as a maxLevel: 3', function () {
    const count = 1000;
    const level = 3;

    const component = mount(
      <Badge count={count} maxLevel={level} />
    );
    expect(
      component.find('.sendbird-label').text()
    ).toEqual('999+');
  });
});
