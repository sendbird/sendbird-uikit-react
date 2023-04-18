import React from 'react';
import { render } from '@testing-library/react';

import Toggle from "../index";
import { filterNumber } from '../utils';

describe('Toggle', () => {
  it('should do a snapshot test of the Toggle DOM', function() {
    const { asFragment } = render(<Toggle />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Toggle/utils: filterNumber', () => {
  it('should filter int from string', () => {
    expect(filterNumber('abcd567hijk')[0]).toBe(567);
  });
  it('should filter float from string', () => {
    expect(filterNumber('abcd5.67hijk')[0]).toBe(5.67);
  });
  it('should filter several int', () => {
    expect(filterNumber('abcd5 6 7hijk')).toStrictEqual([5, 6, 7]);
  });
  it('should filter several float', () => {
    expect(filterNumber('abcd5.6.7hijk')).toStrictEqual([5.6, 7]);
  });
  it('should filter negative numbers', () => {
    expect(filterNumber('abcd-1 2-3.4hijk')).toStrictEqual([-1, 2, -3.4]);
  });
});
