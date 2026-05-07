import React from 'react';
import { render, screen } from '@testing-library/react';

import { MESSAGE_TEMPLATE_KEY } from '../../../utils/consts';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../lib/LocalizationContext';
import { MessageContentForTemplateMessage } from '../MessageContentForTemplateMessage';

jest.mock('date-fns/format', () => () => 'formatted-time');
jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));

const createMessage = (containerOptions = {}) => ({
  messageId: 1,
  createdAt: 1000,
  extendedMessagePayload: {
    [MESSAGE_TEMPLATE_KEY]: {
      type: 'default',
      container_options: containerOptions,
    },
  },
});

const baseProps = {
  userId: 'me',
  channel: {} as any,
  message: createMessage() as any,
  isByMe: false,
  displayThreadReplies: false,
  mouseHover: false,
  isMobile: false,
  isReactionEnabledInChannel: false,
  hoveredMenuClassName: 'hovered',
  templateType: 'default' as any,
  useReplying: false,
  renderSenderProfile: () => <div data-testid="profile">profile</div>,
  renderMessageHeader: () => <div data-testid="header">header</div>,
  renderMessageBody: (props: any) => <div data-testid="body">{String(props.isByMe)}</div>,
};

describe('MessageContentForTemplateMessage', () => {
  beforeEach(() => {
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          groupChannel: {},
        },
      },
    });
    (useLocalization as jest.Mock).mockReturnValue({ dateLocale: {} });
  });

  it('renders incoming template header, body, and timestamp', () => {
    render(<MessageContentForTemplateMessage {...(baseProps as any)} />);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toHaveTextContent('false');
    expect(screen.getByText('formatted-time')).toBeInTheDocument();
  });

  it('hides configured container sections for outgoing or replying messages', () => {
    const { rerender } = render(
      <MessageContentForTemplateMessage
        {...(baseProps as any)}
        message={createMessage({ profile: false, nickname: false, time: false }) as any}
      />,
    );

    expect(screen.queryByTestId('profile')).toBeNull();
    expect(screen.queryByTestId('header')).toBeNull();
    expect(screen.queryByText('formatted-time')).toBeNull();

    rerender(
      <MessageContentForTemplateMessage
        {...(baseProps as any)}
        isByMe
        useReplying
      />,
    );

    expect(screen.queryByTestId('profile')).toBeNull();
    expect(screen.queryByTestId('header')).toBeNull();
    expect(screen.queryByText('formatted-time')).toBeNull();
  });
});
