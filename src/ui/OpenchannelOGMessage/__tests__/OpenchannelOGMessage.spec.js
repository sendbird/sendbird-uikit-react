import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import OpenchannelOGMessage from "../index";
import { MessageProvider } from '../../../modules/Message/context/MessageProvider';
import { MenuRoot } from '../../ContextMenu';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useMediaQueryContext } from '../../../lib/MediaQueryContext';
import { openURL } from '../../../utils/utils';
import { URL_REG, checkOGIsEnalbed, createUrlTester } from '../utils';

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));
jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../lib/MediaQueryContext', () => ({
  ...jest.requireActual('../../../lib/MediaQueryContext'),
  useMediaQueryContext: jest.fn(),
}));
jest.mock('../../../hooks/useLongPress', () => ({
  __esModule: true,
  default: jest.fn(({ onLongPress, onClick }) => ({
    onMouseDown: onLongPress,
    onTouchStart: onLongPress,
    onMouseUp: onClick,
    onTouchEnd: onClick,
  })),
}));
jest.mock('../../../utils/utils', () => ({
  ...jest.requireActual('../../../utils/utils'),
  openURL: jest.fn(),
}));

const userId = 'hh-1234';
const getMockMessage = (callback) => {
  const message = {
    messageType: 'user',
    message: 'I am the Message',
    sendingStatus: 'succeeded',
    createdAt: 1111,
    updatedAt: 0,
    ogMetaData: {
      url: 'https://sendbird.com/',
      title: 'This is the TITLE',
      description: 'I am description I am who has much string in this og meta data',
      defaultImage: {
        url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        alt: 'test',
      },
    },
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      friendName: 'Hoon Baek',
      nickname: 'Honn',
      userId,
    },
    isUserMessage: () => true,
    isResendable: false,
  };
  if (callback) {
    return callback(message);
  }
  return message;
};

describe('ui/OpenchannelOGMessage', () => {
  const renderOGMessage = (message = getMockMessage(), props = {}) => {
    const defaultProps = {
      showEdit: jest.fn(),
      showRemove: jest.fn(),
      resendMessage: jest.fn(),
      userId,
      ...props,
    };
    const view = render(
      <>
        <MenuRoot />
        <MessageProvider message={message}>
          <OpenchannelOGMessage
            message={message}
            {...defaultProps}
          />
        </MessageProvider>
      </>,
    );
    return { ...view, props: defaultProps };
  };

  const openDesktopMenu = (container) => {
    const trigger = container.querySelector('.sendbird-openchannel-og-message__top__context-menu--icon');
    expect(trigger).toBeTruthy();
    fireEvent.click(trigger);
  };

  const clickMenuItem = (testID) => {
    const item = document.querySelector(`[data-testid="${testID}"]`);
    expect(item).toBeTruthy();
    fireEvent.click(item);
  };

  beforeEach(() => {
    useSendbird.mockReturnValue({
      state: {
        config: {
          userId,
        },
      },
    });
    useMediaQueryContext.mockReturnValue({ isMobile: false });
    openURL.mockClear();
    document.queryCommandSupported = jest.fn(() => true);
    document.execCommand = jest.fn(() => true);
  });

  it('should have default elements', function() {
    const message = getMockMessage();
    const { container } = render(
      <MessageProvider message={message}>
        <OpenchannelOGMessage
          message={getMockMessage()}
          userId={userId}
          status="succeeded"
        />
      </MessageProvider>
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message')[0].className
    ).toContain('sendbird-openchannel-og-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__description__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__description').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(0);
  });

  it('should not have elements by chainTop', function() {
    const message = getMockMessage();
    const { container } = render(
      <MessageProvider message={message}>
        <OpenchannelOGMessage
          message={message}
          userId={userId}
          status="succeeded"
          chainTop
        />
      </MessageProvider>
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message')[0].className
    ).toContain('sendbird-openchannel-og-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left__avatar').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sender-name').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sent-at').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__description__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__description').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
  });

  it('should not have og elements when ogMetaData does not exist', function() {
    const message = getMockMessage((message) => ({ ...message, ogMetaData: {} }));
    const { container } = render(
      <MessageProvider message={message}>
        <OpenchannelOGMessage
          message={message}
          status="succeeded"
          userId="hh-1234"
        />
      </MessageProvider>
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message')[0].className
    ).toContain('sendbird-openchannel-og-message');
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__left__avatar').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sender-name').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__title__sent-at').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__description__message').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__description').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(0);
  });

  it('does not render a blank clickable thumbnail when OG image metadata is absent', () => {
    const message = getMockMessage((message) => ({
      ...message,
      ogMetaData: {
        url: 'https://sendbird.com/',
        title: 'This is the TITLE',
        description: 'I am description',
      },
    }));
    const { container } = renderOGMessage(message);

    expect(container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__url').length).toBe(1);
    expect(container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__title').length).toBe(1);
    expect(container.getElementsByClassName('sendbird-openchannel-og-message__bottom__og-tag__thumbnail').length).toBe(0);
  });

  it('should render pending icon if status is pending', function() {
    const message = getMockMessage((message) => ({ ...message, sendingStatus: 'pending' }));
    const { container } = render(
      <MessageProvider message={message}>
        <OpenchannelOGMessage message={message} />
      </MessageProvider>
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(1);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(0);
  });

  it('should render failed icon if status is failed', function() {
    const message = getMockMessage((message) => ({ ...message, sendingStatus: 'failed' }));
    const { container } = render(
      <MessageProvider message={message}>
        <OpenchannelOGMessage
          message={message}
          status="failed"
        />
      </MessageProvider>
    );
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__pending').length
    ).toBe(0);
    expect(
      container.getElementsByClassName('sendbird-openchannel-og-message__top__right__tail__failed').length
    ).toBe(1);
  });

  it('should do a snapshot test of the OpenchannelOGMessage DOM', function() {
    const message = {
      messageType: 'user',
      message: 'I am the Message',
      sendingStatus: 'succeeded',
      createdAt: 1111,
      updatedAt: 0,
      ogMetaData: {
        url: 'https://sendbird.com/',
        title: 'This is the TITLE',
        description: 'I am description I am who has much string in this og meta data',
        defaultImage: {
          url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
          alt: 'test',
        },
      },
      sender: {
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
        friendName: 'Hoon Baek',
        nickname: 'Honn',
        userId: 'hh-1234',
      },
      isUserMessage: () => true,
      isResendable: false,
    };
    const { asFragment } = render(
      <MessageProvider message={message}>
        <OpenchannelOGMessage
          message={message}
          status="succeeded"
          userId="hh-1234"
        />
      </MessageProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('invokes desktop copy, edit, delete, and link actions', () => {
    const message = getMockMessage();
    const { container, props } = renderOGMessage(message);

    openDesktopMenu(container);
    clickMenuItem('open_channel_og_message_menu_copy');
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    openDesktopMenu(container);
    clickMenuItem('open_channel_og_message_menu_edit');
    expect(props.showEdit).toHaveBeenCalledWith(true);

    openDesktopMenu(container);
    clickMenuItem('open_channel_og_message_menu_delete');
    expect(props.showRemove).toHaveBeenCalledWith(true);

    fireEvent.click(container.querySelector('.sendbird-openchannel-og-message__bottom__og-tag__thumbnail'));
    expect(openURL).toHaveBeenCalledWith('https://sendbird.com/');
  });

  it('invokes desktop resend and respects disabled edit/delete actions', () => {
    const failedMessage = getMockMessage((message) => ({
      ...message,
      sendingStatus: 'failed',
      isResendable: true,
    }));
    const failedView = renderOGMessage(failedMessage);

    openDesktopMenu(failedView.container);
    clickMenuItem('open_channel_og_message_menu_resend');
    expect(failedView.props.resendMessage).toHaveBeenCalledWith(failedMessage);

    failedView.unmount();
    const disabledView = renderOGMessage(getMockMessage(), { disabled: true });

    openDesktopMenu(disabledView.container);
    clickMenuItem('open_channel_og_message_menu_edit');
    clickMenuItem('open_channel_og_message_menu_delete');
    expect(disabledView.props.showEdit).not.toHaveBeenCalled();
    expect(disabledView.props.showRemove).not.toHaveBeenCalled();
  });

  it('renders edited labels and ignores non-user messages', () => {
    const editedView = renderOGMessage(getMockMessage((message) => ({
      ...message,
      updatedAt: 1000,
    })));

    expect(screen.getByText('(edited)')).toBeTruthy();

    editedView.unmount();
    const { container } = renderOGMessage({
      messageType: 'admin',
      message: 'admin message',
      ogMetaData: {},
    });

    expect(container.querySelector('.sendbird-openchannel-og-message')).toBeNull();
  });

  it('opens the mobile menu from long press callbacks', () => {
    useMediaQueryContext.mockReturnValue({ isMobile: true });
    const message = getMockMessage();
    const { container, props } = renderOGMessage(message);

    fireEvent.mouseDown(container.querySelector('.sendbird-openchannel-og-message'));
    clickMenuItem('open_channel_mobile_context_menu_copy');
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    fireEvent.mouseDown(container.querySelector('.sendbird-openchannel-og-message'));
    clickMenuItem('open_channel_mobile_context_menu_edit');
    expect(props.showEdit).toHaveBeenCalledWith(true);

    fireEvent.mouseDown(container.querySelector('.sendbird-openchannel-og-message'));
    clickMenuItem('open_channel_mobile_context_menu_delete');
    expect(props.showRemove).toHaveBeenCalledWith(true);
  });

  it('does not expose mobile edit or delete actions in ephemeral mode', () => {
    useMediaQueryContext.mockReturnValue({ isMobile: true });
    const { container } = renderOGMessage(getMockMessage(), { isEphemeral: true });

    fireEvent.mouseDown(container.querySelector('.sendbird-openchannel-og-message'));

    expect(document.querySelector('[data-testid="open_channel_mobile_context_menu_edit"]')).toBeNull();
    expect(document.querySelector('[data-testid="open_channel_mobile_context_menu_delete"]')).toBeNull();
    expect(document.querySelector('[data-testid="open_channel_mobile_context_menu_copy"]')).toBeTruthy();
  });

  it('invokes mobile resend for failed messages', () => {
    useMediaQueryContext.mockReturnValue({ isMobile: true });
    const message = getMockMessage((message) => ({
      ...message,
      sendingStatus: 'failed',
      isResendable: true,
    }));
    const { container, props } = renderOGMessage(message);

    fireEvent.mouseDown(container.querySelector('.sendbird-openchannel-og-message'));
    clickMenuItem('open_channel_mobile_context_menu_resend');

    expect(props.resendMessage).toHaveBeenCalledWith(message);
  });

  it('validates OG metadata helpers', () => {
    const testUrl = createUrlTester(URL_REG);

    expect(testUrl('sendbird.com/uikit')).toBe(true);
    expect(testUrl('not a url')).toBe(false);
    expect(checkOGIsEnalbed({})).toBe(false);
    expect(checkOGIsEnalbed({ ogMetaData: {} })).toBe(false);
    expect(checkOGIsEnalbed({ ogMetaData: { url: 'https://sendbird.com/' } })).toBe(true);
  });
});
