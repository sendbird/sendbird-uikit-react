import React from 'react';

import FilesViewer from "../index";

describe('FilesViewer', () => {
  it('should do a snapshot test of the FilesViewer DOM', function() {
    const component = renderer.create(
      <FilesViewer />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
