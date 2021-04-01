import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import TooltipWrapper from "../index";

import Icon, { IconTypes, IconColors } from '../../Icon';
import Tooltip from '../../Tooltip';

const iconClassName = 'icon-class-name';
const tooltipClassName = 'tooltip-class-name';
const tooltipText = 'sample-text';
const tooltipWrapperClassName = 'tooltip-wrapper-class-name';

const tooltipWrapperComponent = (
  <TooltipWrapper
    className={tooltipWrapperClassName}
    hoverTooltip={<Tooltip className={tooltipClassName}>{tooltipText}</Tooltip>}
  >
    <Icon className={iconClassName} fillColor={IconColors.PRIMARY} type={IconTypes.ADD} />
  </TooltipWrapper>
);

describe('TooltipWrapper', () => {
  it('should exist after mouseover', function () {
    const component = shallow(tooltipWrapperComponent);

    expect(
      component.find('.sendbird-tooltip-wrapper__children').text()
    ).toEqual('<Icon />');

    expect(
      component.find('.sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container').exists()
    ).toBe(false);

    component.find('.sendbird-tooltip-wrapper').simulate('mouseover');

    expect(
      component.find('.sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container').exists()
    ).toBe(true);
  });

  it('should contain tooltip after mouseover', function () {
    const component = mount(tooltipWrapperComponent);

    expect(
      component.contains(<Icon className={iconClassName} fillColor={IconColors.PRIMARY} type={IconTypes.ADD} />)
    ).toBe(true);

    expect(
      component.contains(<Tooltip className={tooltipClassName}>{tooltipText}</Tooltip>)
    ).toBe(false);

    component.simulate('mouseover');

    expect(
      component.contains(<Tooltip className={tooltipClassName}>{tooltipText}</Tooltip>)
    ).toBe(true);
  })

  it('should do a snapshot test of the TooltipWrapper DOM', function () {
    const component = renderer.create(
      <TooltipWrapper
        hoverTooltip={<Tooltip>Test Text</Tooltip>}
      >
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      </TooltipWrapper>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
