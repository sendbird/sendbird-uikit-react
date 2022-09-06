import React from 'react';
import { render, screen } from '@testing-library/react';

import ReactionButton from "../index";
import Icon, { IconTypes } from '../../Icon';

const children = <Icon type={IconTypes.CREATE} width="28px" height="28px" />;

describe('ReactionButton', () => {
  it('should render className prop', function () {
    const text = "example-text";
    const { container } = render(<ReactionButton className={text}>{children}</ReactionButton>);
    expect(
      screen.getByTestId('sendbird-reaction-button').className
    ).toContain('sendbird-reaction-button');
    expect(
      container.getElementsByClassName('sendbird-reaction-button').length
    ).toBe(1);
  });

  it('should do a snapshot test of the ReactionButton DOM', function () {
    const text = "example-text";
    const { asFragment } = render(
      <ReactionButton className={text} width="36px" height="36px">
        {children}
      </ReactionButton>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
