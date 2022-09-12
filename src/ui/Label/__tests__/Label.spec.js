import React from 'react';
import { render, screen } from '@testing-library/react';

import Label, { LabelTypography, LabelColors } from '../index.jsx';
import { changeTypographyToClassName, changeColorToClassName } from '../utils.js';

describe('ui/Label', () => {
  it('should have default classname if props are not provided', function () {
    const text = 'Example';
    const { container } = render(
      <Label
        type={LabelTypography.H_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        {text}
      </Label>
    );
    expect(
      container.querySelector('.sendbird-label').className
    ).toContain('sendbird-label--h-1');
    expect(
      container.querySelector('.sendbird-label').className
    ).toContain('sendbird-label--color-onbackground-1');
    expect(
      screen.getByText(text).className
    ).toContain('sendbird-label');
  });

  it('should have each typography', function () {
    for (let color in LabelColors) {
      for (let typography in LabelTypography) {
        const { container } = render(<Label color={color} type={typography}>Component</Label>);
        expect(
          container.querySelector('.sendbird-label').className
        ).toContain(changeColorToClassName(color));
        expect(
          container.querySelector('.sendbird-label').className
        ).toContain(changeTypographyToClassName(typography));
      }
    }
  });

  it('should create a snapshot of a default label component', function () {
    const { asFragment } = render(
      <Label
        type={LabelTypography.H_1}
        color={LabelColors.ONBACKGROUND_1}
      >
        Example
      </Label>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
