import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ReactionButton from "../index";
import Icon, { IconTypes } from '../../Icon';

const children = <Icon type={IconTypes.CREATE} width="28px" height="28px" />;

describe('ReactionButton', () => {
  it('should render className prop', function () {
    const text = "example-text";
    const component = shallow(<ReactionButton className={text}>{children}</ReactionButton>);

    expect(
      component.find(".sendbird-reaction-button").hasClass(text)
    ).toBe(true);
  });

  it('should do a snapshot test of the ReactionButton DOM', function () {
    const text = "example-text";
    const component = renderer.create(
      <ReactionButton className={text} width="36px" height="36px">
        {children}
      </ReactionButton>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
