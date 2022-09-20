import React from 'react';
import { render } from '@testing-library/react';

import Tooltip from "../index";

describe('ui/Tooltip', () => {
  it('should have className', function () {
    const className = "example-text";
    const text = 'Sravan S, Hoon Baek, Chong Bu, Mickey, Leo Shin, Doo Rim, Tez Park, Harry Kim, and you';
    const { container } = render(
      <Tooltip className={className}>
        {text}
      </Tooltip>
    );
    expect(
      container.querySelectorAll('.sendbird-tooltip')
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the ReactedUsers DOM', function () {
    const className = "example-text";
    const text = 'Sravan S, Hoon Baek, Chong Bu, Mickey, Leo Shin, Doo Rim, Tez Park, Harry Kim, and you';
    const { asFragment } = render(
      <Tooltip className={className}>
        {text}
      </Tooltip>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
