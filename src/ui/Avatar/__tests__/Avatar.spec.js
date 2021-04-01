import React from 'react';
import renderer from 'react-test-renderer';

import Avatar from '../index';

const src = 'https://avatars3.githubusercontent.com/u/46333979?s=460&v=4';
const src1 = 'https://avatars1.githubusercontent.com/u/1384313?s=460&v=4';
const src2 = 'https://avatars2.githubusercontent.com/u/11382805?s=460&v=4';
const src3 = '';

describe('Avatar', () => {
  it('should render default image if src is empty', function() {
    const component = renderer.create(
      <Avatar />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should do a snapshot test of the Avatar DOM with single element', function() {
    const component = renderer.create(
      <Avatar src={src} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should do a snapshot test of the Avatar DOM with two elements', function() {
    const component = renderer.create(
      <Avatar src={[src, src1]} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should do a snapshot test of the Avatar DOM with three elements', function() {
    const component = renderer.create(
      <Avatar src={[src, src1, src2]} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should do a snapshot test of the Avatar DOM with four elements', function() {
    const component = renderer.create(
      <Avatar src={[src, src1, src2, src3]} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
