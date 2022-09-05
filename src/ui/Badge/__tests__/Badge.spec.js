import React from 'react';
import { render, screen } from '@testing-library/react';

import Badge from "../index";

describe('Badge', () => {
  it('should do a snapshot test of the Badge DOM', function () {
    const count = 1;
    const { asFragment } = render(<Badge count={count} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display maximum number as a maxLevel: 1', function () {
    const count = 10;
    const level = 1;

    render(<Badge count={count} maxLevel={level} />);
    expect(screen.getByText('9+')).toBeTruthy();
  });

  it('should display maximum number as a maxLevel: 2 (default level)', function () {
    const count = 100;

    render(<Badge count={count} />);
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('should display maximum number as a maxLevel: 3', function () {
    const count = 1000;
    const level = 3;

    render(<Badge count={count} maxLevel={level} />);
    expect(screen.getByText('999+')).toBeTruthy();
  });
});
