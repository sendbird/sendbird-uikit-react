import React from 'react';
import { render } from '@testing-library/react';

import OGMessageItemBody from "../index";
import { MessageProvider } from '../../../modules/Message/context/MessageProvider';

describe('ui/OGMessageItemBody', () => {
  it('should do a snapshot test of the OGMessageItemBody DOM', function() {
    const text = "example-text";
    const message = {
      ogMetaData: {
        title: text,
        description: text,
        url: text,
        defaultImage: {
          url: 'https://image-url.com'
        },
      },
      message: text,
    };
    const { asFragment } = render(
      <MessageProvider message={message}>
        <OGMessageItemBody message={message} />
      </MessageProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should add .sendbird-og-message-item-body__og-thumbnail__image-empty classname when image is empty', () => {
    const message = {
      message: 'example-text',
      ogMetaData: { defaultImage: { url: undefined } },
    };
    const { container } = render(
      <MessageProvider message={message}>
        <OGMessageItemBody message={message} />
      </MessageProvider>
    );
    expect(container.getElementsByClassName('sendbird-og-message-item-body__og-thumbnail__empty').length).toBe(1);
  });
});
