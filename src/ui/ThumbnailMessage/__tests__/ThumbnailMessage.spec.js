import React from 'react';
import { mount } from 'enzyme';
import ThumbnailMessage from '../index.jsx';

import message from '../dummyData.mock';
import { getMessageCreatedAt } from '../util';

const noop = () => { };

let realUseContext;
let useContextMock;
describe('Thumbnail Message', () => {
  // Setup mock
  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = () => ({
      disableUserProfile: false,
      renderUserProfile: null,
    });
  });

  // Cleanup mock
  afterEach(() => {
    React.useContext = realUseContext;
  });

  it('should handle incoming message', () => {
    const component = mount(
      <ThumbnailMessage
        useReaction
        onClick={noop}
        isByMe={false}
        message={message}
      />
    );
    expect(component.find('.sendbird-incoming-thumbnail-message__avatar').hostNodes().text()).toEqual('');
    expect(component.find('.sendbird-incoming-thumbnail-message__sender-name').hostNodes().text()).toEqual(message.sender.nickname);
    expect(component.find('.sendbird-incoming-thumbnail-message__sent-at').hostNodes().text()).toEqual(getMessageCreatedAt(message));
  });

  it('should handle outgoing message', () => {
    const component = mount(
      <ThumbnailMessage
        useReaction
        onClick={noop}
        isByMe
        message={message}
      />
    );
    expect(
      component.find('.sendbird-incoming-thumbnail-message__avatar').exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__sender-name').exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__sent-at').exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-outgoing-thumbnail-message__left-padding').exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-outgoing-thumbnail-message__body').exists()
    ).toEqual(true);
  });

  it('should display sender nickname, avatar and sent at - incoming', () => {
    const component = mount(
      <ThumbnailMessage
        isByMe={false}
        message={message}
        useReaction
      />
    );

    expect(
      component.find('.sendbird-incoming-thumbnail-message__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender nickname when chainTop - incoming', () => {
    const component = mount(
      <ThumbnailMessage
        isByMe={false}
        message={message}
        useReaction
        chainTop
      />
    );

    expect(
      component.find('.sendbird-incoming-thumbnail-message__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender avatar and sent at when chainBottom - incoming', () => {
    const component = mount(
      <ThumbnailMessage
        isByMe={false}
        message={message}
        useReaction
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-incoming-thumbnail-message__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should not display nickname, sender avatar and sent at when chainTop and chainBottom - incoming', () => {
    const component = mount(
      <ThumbnailMessage
        isByMe={false}
        message={message}
        useReaction
        chainTop
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-incoming-thumbnail-message__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-thumbnail-message__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should display message status - outgoing', () => {
    const component = mount(
      <ThumbnailMessage
        isByMe
        message={message}
        useReaction
        status="READ"
      />
    );

    expect(
      component.find('.sendbird-outgoing-thumbnail-message-left-padding__status').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display message status when chainBottom - outgoing', () => {
    const component = mount(
      <ThumbnailMessage
        isByMe
        message={message}
        useReaction
        status="READ"
      />
    );

    expect(
      component.find('.sendbird-outgoing-thumbnail-message-left-padding__status').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(true);
  });
});
