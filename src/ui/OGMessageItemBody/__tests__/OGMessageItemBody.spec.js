import React from 'react';
import { render } from '@testing-library/react';

import OGMessageItemBody from "../index";

describe('ui/OGMessageItemBody', () => {
  it('should do a snapshot test of the OGMessageItemBody DOM', function() {
    const text = "example-text";
    const { asFragment } = render(<OGMessageItemBody message={{
      ogMetaData: {
        title: text,
        description: text,
        url: text,
        image: text,
      },
    }} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should add .sendbird-og-message-item-body__og-thumbnail__image-empty classname when image is empty', () => {
    const { container } = render(<OGMessageItemBody />);
    expect(container.getElementsByClassName('sendbird-og-message-item-body__og-thumbnail__empty').length).toBe(1);
  });
});
