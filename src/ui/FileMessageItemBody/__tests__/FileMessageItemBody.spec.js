import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import FileMessageItemBody from "../index";

const createMockMessage = (process) => {
  const mockMessage = {
    type: 'image/png',
    url: 'https://sendbird.com',
    name: 'My name is name',
    reactions: [],
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('FileMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const className = 'classname-for-test';
    const component = mount(
      <FileMessageItemBody
        className={className}
        message={createMockMessage()}
      />
    );
    expect(
      component.find('.sendbird-file-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find(`.${className}.sendbird-file-message-item-body`).hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-file-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-file-message-item-body.reactions').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-file-message-item-body__file-icon').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body__file-icon__icon').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body__file-name').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body__file-name__text').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body__file-name__text').hostNodes().last().text()
    ).toBe(createMockMessage().name);
  });

  it('should render url when name does not exist', () => {
    const component = mount(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          name: '',
        }))}
      />
    );
    expect(
      component.find('.sendbird-file-message-item-body__file-name').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-file-message-item-body__file-name__text').hostNodes().last().text()
    ).toBe(createMockMessage().url);
  });

  it('should have class name by isByMe prop', () => {
    const outgoingMessage = mount(
      <FileMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      outgoingMessage.find('.sendbird-file-message-item-body.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-file-message-item-body.incoming').hostNodes().exists()
    ).toBe(false);
    const incomingMessage = mount(
      <FileMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      incomingMessage.find('.sendbird-file-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-file-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by mouseHover prop', () => {
    const component = mount(
      <FileMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      component.find('.sendbird-file-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by reactions of message prop', () => {
    const component = mount(
      <FileMessageItemBody
        isReactionEnabled
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}],
        }))}
      />
    );
    expect(
      component.find('.sendbird-file-message-item-body.reactions').hostNodes().exists()
    ).toBe(true);
  });

  it('should render icons by type of message prop', () => {
    const imageMessage = mount(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/jpg',
        }))}
      />
    );
    expect(
      imageMessage.find('.sendbird-file-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      imageMessage.find('.sendbird-icon').hostNodes().exists()
    ).toBe(true);
    expect(
      imageMessage.find('.sendbird-icon-photo').hostNodes().exists()
    ).toBe(true);
    const videoMessage = mount(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'video/mp4',
        }))}
      />
    );
    expect(
      videoMessage.find('.sendbird-file-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      videoMessage.find('.sendbird-icon').hostNodes().exists()
    ).toBe(true);
    expect(
      videoMessage.find('.sendbird-icon-play').hostNodes().exists()
    ).toBe(true);
    const audioMessage = mount(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'audio/mp3',
        }))}
      />
    );
    expect(
      audioMessage.find('.sendbird-file-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      audioMessage.find('.sendbird-icon').hostNodes().exists()
    ).toBe(true);
    expect(
      audioMessage.find('.sendbird-icon-file-audio').hostNodes().exists()
    ).toBe(true);
    const gifMessage = mount(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/gif',
        }))}
      />
    );
    expect(
      gifMessage.find('.sendbird-file-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      gifMessage.find('.sendbird-icon').hostNodes().exists()
    ).toBe(true);
    expect(
      gifMessage.find('.sendbird-icon-gif').hostNodes().exists()
    ).toBe(true);
    const documentMessage = mount(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/pdf',
        }))}
      />
    );
    expect(
      documentMessage.find('.sendbird-file-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      documentMessage.find('.sendbird-icon').hostNodes().exists()
    ).toBe(true);
    expect(
      documentMessage.find('.sendbird-icon-file-document').hostNodes().exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the FileMessageItemBody DOM', function () {
    const component = renderer.create(
      <FileMessageItemBody
        className="classname-for-snapshot"
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}],
        }))}
        isByMe
        mouseHover
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
