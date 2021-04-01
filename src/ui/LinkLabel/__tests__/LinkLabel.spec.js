import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import LinkLabel, { LinkLabelTypography, LinkLabelColors } from "../index";

const container = document.createElement('div');
const LINK_LABEL = 'sendbird-link-label';

describe('LinkLabel', () => {
  it('should render link label', function() {
    const CLASS_NAME = 'example-class-name';
    const text = 'example-text';
    const component = mount(
      <LinkLabel
        className={CLASS_NAME}
        src="https://www.sendbird.com"
        color={LinkLabelColors.PRIMARY}
        type={LinkLabelTypography.BODY_1}
      >
        {text}
      </LinkLabel>
    );

    expect(
      component.find(`.${CLASS_NAME}`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${LINK_LABEL}`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${LINK_LABEL}__label`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${LINK_LABEL}__label`).hostNodes().text()
    ).toEqual(text);
  });

  it('should do a snapshot test of the LinkLabel DOM', function() {
    const text = 'example-text';
    const component = renderer.create(
      <LinkLabel
        src="https://www.sendbird.com"
        color={LinkLabelColors.PRIMARY}
        type={LinkLabelTypography.BODY_1}
      >
        {text}
      </LinkLabel>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
