import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ReactionBadge from "../index";
import Icon, { IconTypes } from '../../Icon';

describe('ReactionBadge', () => {
  it('should have className', function () {
    const text = "example-text";
    const component = shallow(
      <ReactionBadge className={text}>
        <Icon type={IconTypes.CREATE} width="20px" height="20px" />
      </ReactionBadge>
    );

    expect(
      component.find(".sendbird-reaction-badge").hasClass(text)
    ).toBe(true);
  });

  it('should do a snapshot test of the ReactionBadge DOM', function () {
    const text = "example-text";
    const inputCount = 1000;

    const component = renderer.create(
      <ReactionBadge count={inputCount > 99 ? '+99' : inputCount} className={text}>
        <Icon type={IconTypes.CREATE} width="20px" height="20px" />
      </ReactionBadge>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
