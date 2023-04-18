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
  it('should return empty array', () => {
    expect(filterNumber('')).toEqual([]);
    expect(filterNumber('dlkfjk-ldjs.hge')).toEqual([]);
    expect(filterNumber(null)).toEqual([]);
    expect(filterNumber(undefined)).toEqual([]);
  });
  it('should filter int from string', () => {
    expect(filterNumber('123')).toEqual([123]);
    expect(filterNumber('a1b2c3d')).toEqual([1, 2, 3]);
    expect(filterNumber('abcd567hijk')).toEqual([567]);
  });
  it('should filter float from string', () => {
    expect(filterNumber('1.23')).toEqual([1.23]);
    expect(filterNumber('abcd5.67hijk')[0]).toBe(5.67);
  });
  it('should filter several int', () => {
    expect(filterNumber('abcd5 6 7hijk')).toEqual([5, 6, 7]);
  });
  it('should filter several float', () => {
    expect(filterNumber('abcd5.6.7hijk')).toEqual([5.6, 7]);
  });
  it('should filter negative numbers', () => {
    expect(filterNumber('-10.5 20 30.5')).toEqual([-10.5, 20, 30.5]);
    expect(filterNumber('abcd-1 2-3.4hijk')).toEqual([-1, 2, -3.4]);
  });
});
