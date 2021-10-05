import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

describe('ThumbnailMessageItemBody', () => {
  it('should have class names by own basic status', () => {
    const className = 'test-class-name';
    const component = mount(
      <ThumbnailMessageItemBody
        className={className}
        message={createMockMessage()}
      />
    );
    expect(
      component.find('.sendbird-thumbnail-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find(`.${className}.sendbird-thumbnail-message-item-body`).hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-thumbnail-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-thumbnail-message-item-body.reactions').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__thumbnail').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__placeholder').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__video').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__image-cover').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__icon-wrapper').hostNodes().exists()
    ).toBe(false);

    expect(
      component.find('.sendbird-icon-photo').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('sendbird-icon-play').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('sendbird-icon-gif').hostNodes().exists()
    ).toBe(false);
  });

  it('should have class name by isByMe prop', () => {
    const outgoingMessage = mount(
      <ThumbnailMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      outgoingMessage.find('.sendbird-thumbnail-message-item-body.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-thumbnail-message-item-body.incoming').hostNodes().exists()
    ).toBe(false);
    const incomingMessage = mount(
      <ThumbnailMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      incomingMessage.find('.sendbird-thumbnail-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-thumbnail-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by mouseHover prop', () => {
    const component = mount(
      <ThumbnailMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      component.find('.sendbird-thumbnail-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(true);
  });

  it('should render video components when file type is video', () => {
    const component = mount(
      <ThumbnailMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'video/mp4',
        }))}
      />
    );
    expect(
      component.find('.sendbird-thumbnail-message-item-body__thumbnail').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__video').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__icon-wrapper').hostNodes().exists()
    ).toBe(true);

    expect(
      component.find('.sendbird-icon-photo').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-icon-play').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-icon-gif').hostNodes().exists()
    ).toBe(false);
  });

  it('should render gif components when file type is image/gif', () => {
    const component = mount(
      <ThumbnailMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/gif',
        }))}
      />
    );
    expect(
      component.find('.sendbird-thumbnail-message-item-body__thumbnail').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__video').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-thumbnail-message-item-body__icon-wrapper').hostNodes().exists()
    ).toBe(true);

    expect(
      component.find('.sendbird-icon-photo').hostNodes().exists()
    ).toBe(true); // as a default component
    expect(
      component.find('.sendbird-icon-play').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-icon-gif').hostNodes().exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the ThumbnailMessageItemBody DOM', function() {
    const component = renderer.create(
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
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
