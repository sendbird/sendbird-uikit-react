import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ImageGrid from "../index";

describe('ImageGrid', () => {
  it('should do a snapshot test of the ImageGrid DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <ImageGrid />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
