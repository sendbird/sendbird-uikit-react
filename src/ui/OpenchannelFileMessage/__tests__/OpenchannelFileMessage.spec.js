import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { dummyFileMessageImage, getFileMessage } from '../mockMessages';

import OpenchannelFileMessage from "../index";

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));

describe('OpenchannelFileMessage', () => {
  it('should render default elements', function() {
    const component = mount(
      <OpenchannelFileMessage
        message={dummyFileMessageImage}
      />
    );

      expect(
        component.find('.sendbird-openchannel-file-message').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__left__avatar').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sender-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sent-at').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__icon').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__file-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__context-menu').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__pending').exists()
      ).toBe(false);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__failed').exists()
      ).toBe(false);
  });

  it('should not render elements when chainTop is true', function() {
    const component = mount(
      <OpenchannelFileMessage
        message={dummyFileMessageImage}
        chainTop
      />
    );

      expect(
        component.find('.sendbird-openchannel-file-message').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__left__avatar').exists()
      ).toBe(false);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sender-name').exists()
      ).toBe(false);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sent-at').exists()
      ).toBe(false);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__icon').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__file-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__context-menu').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__pending').exists()
      ).toBe(false);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__failed').exists()
      ).toBe(false);
  });

  it('should render pending icon if status is pending', function() {
    const component = mount(
      <OpenchannelFileMessage
        message={getFileMessage((m) => ({ ...m, sendingStatus: 'pending' }))}
      />
    );

      expect(
        component.find('.sendbird-openchannel-file-message').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__left__avatar').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sender-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sent-at').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__icon').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__file-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__context-menu').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__pending').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__failed').exists()
      ).toBe(false);
  });

  it('should render pending icon if status is failed', function() {
    const component = mount(
      <OpenchannelFileMessage
        message={getFileMessage((m) => ({ ...m, sendingStatus: 'failed' }))}
        status="failed"
      />
    );

      expect(
        component.find('.sendbird-openchannel-file-message').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__left__avatar').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sender-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__title__sent-at').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__icon').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__body__file-name').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__context-menu').exists()
      ).toBe(true);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__pending').exists()
      ).toBe(false);
      expect(
        component.find('.sendbird-openchannel-file-message__right__tail__failed').exists()
      ).toBe(true);
  });

  it('should do a snapshot test of the OpenchannelFileMessage DOM', function() {
    const component = renderer.create(
      <OpenchannelFileMessage
        message={dummyFileMessageImage}
        status="succeeded"
        userId="hoon1234"
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
