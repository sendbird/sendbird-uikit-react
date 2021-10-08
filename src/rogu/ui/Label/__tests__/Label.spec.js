import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import Label, { LabelTypography, LabelColors } from '../index.jsx';
import { changeTypographyToClassName, changeColorToClassName } from '../utils.js';

describe('Label', () => {
  it('should have default classname if props are not provided', function () {
    const text = 'Example';
    const component = shallow(
      <Label
        type={LabelTypography.H_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        {text}
      </Label>
    );
    expect(
      component.find(".sendbird-label").hasClass("sendbird-label--h-1")
    ).toBeTruthy();
    expect(
      component.find(".sendbird-label").hasClass("sendbird-label--color-onbackground-1")
    ).toBe(true);
    expect(
      component.find(".sendbird-label").text()
    ).toEqual(text)
  });

  it('should have each typography', function () {
    for (let color in LabelColors) {
      for (let typography in LabelTypography) {
        const component = shallow(<Label color={color} type={typography}>Component</Label>);
        expect(
          component.find('.sendbird-label').hasClass(changeColorToClassName(color))
        ).toBeTruthy();
        expect(
          component.find('.sendbird-label').hasClass(changeTypographyToClassName(typography))
        ).toBe(true);
      }
    }
  });

  it('should create a snapshot of a default label component', function () {
    const component = renderer.create(
      <Label
        type={LabelTypography.H_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        Example
      </Label>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
