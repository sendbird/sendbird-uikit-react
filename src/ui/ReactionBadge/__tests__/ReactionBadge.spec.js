import React from 'react';
import { render, screen } from '@testing-library/react';

import ReactionBadge from "../index";
import Icon, { IconTypes } from '../../Icon';

describe('ReactionBadge', () => {
  it('should have className', function () {
    const text = "example-text";
    render(
      <ReactionBadge className={text}>
        <Icon type={IconTypes.CREATE} width="20px" height="20px" />
      </ReactionBadge>
    );
    expect(screen.getAllByRole('button')[0].className).toContain(text);
  });

  it('should do a snapshot test of the ReactionBadge DOM', function () {
    const text = "example-text";
    const inputCount = 1000;

    const { asFragment } = render(
      <ReactionBadge count={inputCount > 99 ? '+99' : inputCount} className={text}>
        <Icon type={IconTypes.CREATE} width="20px" height="20px" />
      </ReactionBadge>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
