import React from 'react';
import { render, screen } from '@testing-library/react';

import LinkLabel, { LinkLabelTypography, LinkLabelColors } from "../index";

const LINK_LABEL = 'sendbird-link-label';

describe('ui/LinkLabel', () => {
  it('should render link label', function() {
    const CLASS_NAME = 'example-class-name';
    const text = 'example-text';
    const { container } = render(
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
      container.getElementsByClassName('sendbird-link-label')[0].className
    ).toContain(CLASS_NAME);
    expect(
      container.getElementsByClassName('sendbird-link-label')[0].className
    ).toContain(LINK_LABEL);
    expect(
      container.getElementsByClassName('sendbird-link-label')[0].children[0].className
    ).toContain(`${LINK_LABEL}__label`);
    expect(
      screen.getByText(text).className
    ).toContain(`${LINK_LABEL}__label`);
  });

  it('should do a snapshot test of the LinkLabel DOM', function() {
    const text = 'example-text';
    const { asFragment } = render(
      <LinkLabel
        src="https://www.sendbird.com"
        color={LinkLabelColors.PRIMARY}
        type={LinkLabelTypography.BODY_1}
      >
        {text}
      </LinkLabel>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
