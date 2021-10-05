import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import UnknownMessageItemBody from "../index";

const createMockMessage = (process) => {
  const mockMessage = {
    reactions: [],
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('UnknownMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const className = 'class-name-for-test';
    const component = mount(
      <UnknownMessageItemBody
        className={className}
        message={createMockMessage()}
      />
    );
    expect(
      component.find('.sendbird-unknown-message-item-body').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-unknown-message-item-body__header').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-unknown-message-item-body__description').hostNodes().exists()
    ).toBe(true);

    expect(
      component.find(`.${className}.sendbird-unknown-message-item-body`).hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-unknown-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-unknown-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-unknown-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(false);
    expect(
      component.find('.sendbird-unknown-message-item-body.reactions').hostNodes().exists()
    ).toBe(false);
  });

  it('should have class name by isByMe', () => {
    const outgoingMessage = mount(
      <UnknownMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      outgoingMessage.find('.sendbird-unknown-message-item-body.outgoing').hostNodes().exists()
    ).toBe(true);
    expect(
      outgoingMessage.find('.sendbird-unknown-message-item-body.incoming').hostNodes().exists()
    ).toBe(false);
    const incomingMessage = mount(
      <UnknownMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      incomingMessage.find('.sendbird-unknown-message-item-body.outgoing').hostNodes().exists()
    ).toBe(false);
    expect(
      incomingMessage.find('.sendbird-unknown-message-item-body.incoming').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by mouseHover prop', () => {
    const component = mount(
      <UnknownMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      component.find('.sendbird-unknown-message-item-body.mouse-hover').hostNodes().exists()
    ).toBe(true);
    expect(
      component.find('.sendbird-unknown-message-item-body.incoming.mouse-hover').hostNodes().exists()
    ).toBe(true);
  });

  it('should have class name by reactions of message', () => {
    const component = mount(
      <UnknownMessageItemBody
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          reactions: [{}, {}, {}],
        }))}
      />
    );
    expect(
      component.find('.sendbird-unknown-message-item-body.reactions').hostNodes().exists()
    ).toBe(true);
  });

  it('should do a snapshot test of the UnknownMessageItemBody DOM', function () {
    const component = renderer.create(
      <UnknownMessageItemBody
        className="class-name-for-snapshot"
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}, {}],
        }))}
        isByMe
        mouseHover
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
