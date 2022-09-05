import React from 'react';
import { render, screen } from '@testing-library/react';

import Button from "../index";
import { Size } from '../type';

describe('ui/Button', () => {
  it('should do a snapshot test of the default Button DOM', function () {
    const { asFragment } = render(<Button />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should do a snapshot test of the small Button DOM', function () {
    const { asFragment } = render(<Button size={Size.SMALL} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should contain className', function () {
    const text = 'example-text';
    render(<Button className={text} />);
    expect(screen.getByRole('button').className).toContain(text);
  });
});
