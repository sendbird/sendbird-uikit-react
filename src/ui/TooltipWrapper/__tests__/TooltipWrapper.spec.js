import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import TooltipWrapper from "../index";

import Icon, { IconTypes, IconColors, changeTypeToIconClassName, changeColorToClassName } from '../../Icon';
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

describe('ui/TooltipWrapper', () => {
  it('should exist after mouseover', function () {
    const { container } = render(tooltipWrapperComponent);

    expect(
      screen.getByTestId('sendbird-tooltip-wrapper').children[0].className
    ).toBe('sendbird-tooltip-wrapper__children');
    expect(
      screen.getByTestId('sendbird-tooltip-wrapper').children[0].children[0].className
    ).toContain(iconClassName);
    expect(
      container.querySelectorAll('.sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container')
    ).toHaveLength(0);
    fireEvent.mouseOver(container.querySelector('.sendbird-tooltip-wrapper'));
    expect(
      container.querySelectorAll('.sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container')
    ).toHaveLength(1);
  });

  it('should contain tooltip after mouseover', function () {
    const { container } = render(tooltipWrapperComponent);

    expect(
      container.getElementsByClassName(iconClassName)
    ).toHaveLength(1);
    expect(
      screen.getByTestId('sendbird-icon').className
    ).toContain(changeTypeToIconClassName(IconTypes.ADD));
    expect(
      screen.getByTestId('sendbird-icon').className
    ).toContain(changeColorToClassName(IconColors.PRIMARY));

    expect(
      container.getElementsByClassName(tooltipClassName)
    ).toHaveLength(0);
    fireEvent.mouseOver(container.querySelector(`.${tooltipWrapperClassName}`));
    expect(
      container.getElementsByClassName(tooltipClassName)
    ).toHaveLength(1);
  })

  it('should do a snapshot test of the TooltipWrapper DOM', function () {
    const { asFragment } = render(
      <TooltipWrapper
        hoverTooltip={<Tooltip>Test Text</Tooltip>}
      >
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      </TooltipWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
