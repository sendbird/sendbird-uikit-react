import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MultipleFilesViewer from "../index";

describe('MultipleFilesViewer', () => {
  it('should do a snapshot test of the MultipleFilesViewer DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <MultipleFilesViewer />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
