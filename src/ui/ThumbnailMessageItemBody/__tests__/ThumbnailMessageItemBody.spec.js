import React from 'react';
import { render, screen } from '@testing-library/react';

import ThumbnailMessageItemBody from "../index";

const createMockMessage = (process) => {
  const mockMessage = {
    url: 'https://static.sendbird.com/sample/user_sdk/user_sdk_25.png',
    name: 'A flag on the moon',
    type: 'image/png',
    messageType: 'file',
    reactions: [],
    thumbnails: [],
    isFileMessage: () => true,
    isUserMessage: () => false,
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('ui/ThumbnailMessageItemBody', () => {
  it('should have class names by own basic status', () => {
    const className = 'test-class-name';
    const { container } = render(
      <ThumbnailMessageItemBody
        className={className}
        message={createMockMessage()}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-thumbnail-message-item-body')[0].className
    ).toContain('sendbird-thumbnail-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-thumbnail-message-item-body')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll(`.${className}.sendbird-thumbnail-message-item-body`)
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.incoming')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.mouse-hover')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.reactions')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__thumbnail')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__placeholder')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__video')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__image-cover')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__icon-wrapper')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('sendbird-icon-play')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('sendbird-icon-gif')
    ).toHaveLength(0);
  });

  it('should have class name when isByMe is true', () => {
    const { container } = render(
      <ThumbnailMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.outgoing')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.incoming')
    ).toHaveLength(0);
  });
  it('should have class name when isByMe is false', () => {
    const { container } = render(
      <ThumbnailMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.incoming')
    ).toHaveLength(1);
  });

  it('should have class name by mouseHover prop', () => {
    const { container } = render(
      <ThumbnailMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body.mouse-hover')
    ).toHaveLength(1);
  });

  it('should render video components when file type is video', () => {
    const { container } = render(
      <ThumbnailMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'video/mp4',
        }))}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__thumbnail')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__video')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__icon-wrapper')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-icon-photo')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-icon-play')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-icon-gif')
    ).toHaveLength(0);
  });

  it('should render gif components when file type is image/gif', () => {
    const { container } = render(
      <ThumbnailMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/gif',
        }))}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__thumbnail')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__video')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-thumbnail-message-item-body__icon-wrapper')
    ).toHaveLength(1);

    expect(
      container.querySelectorAll('.sendbird-icon-play')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-icon-gif')
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the ThumbnailMessageItemBody DOM', function () {
    const { asFragment } = render(
      <ThumbnailMessageItemBody
        className="classname-for-snapshot"
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}],
          thumbnails: ['https://static.sendbird.com/sample/user_sdk/user_sdk_25.png'],
        }))}
        isByMe
        mouseHover
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
