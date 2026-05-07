import React from 'react';
import { render, screen } from '@testing-library/react';
import TemplateMessageItemBody, { replaceVariablesInTemplateString } from '../index';
import { MESSAGE_TEMPLATE_KEY } from '../../../utils/consts';

let mockSendbirdState;

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({ state: mockSendbirdState }),
}));

jest.mock('../../../modules/GroupChannel/components/MessageTemplateWrapper', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ templateVersion, templateItems }) => (
      React.createElement('pre', { 'data-testid': 'template-wrapper' }, JSON.stringify({ templateVersion, templateItems }))
    ),
  };
});

const createMessage = (templateData?: Record<string, any>, message = 'fallback text') => ({
  messageId: 100,
  message,
  extendedMessagePayload: templateData
    ? { [MESSAGE_TEMPLATE_KEY]: templateData }
    : {},
} as any);

const createState = ({
  cachedTemplates = {},
  waitingTemplateKeysMap = {},
  updateMessageTemplatesInfo = jest.fn(),
  logger = { error: jest.fn() },
}: {
  cachedTemplates?: Record<string, any>;
  waitingTemplateKeysMap?: Record<string, any>;
  updateMessageTemplatesInfo?: jest.Mock;
  logger?: { error: jest.Mock };
} = {}) => ({
  config: { logger },
  stores: {
    appInfoStore: { waitingTemplateKeysMap },
  },
  utils: {
    getCachedTemplate: jest.fn((key) => cachedTemplates[key]),
    updateMessageTemplatesInfo,
  },
});

describe('TemplateMessageItemBody', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockSendbirdState = createState();
  });

  it('replaces data and color variables in template strings', () => {
    expect(replaceVariablesInTemplateString({
      template: '{user.name} uses {button.background} and {missing}',
      templateData: { user: { name: 'Jane' } },
      colorVariables: { button: { background: 'light-color,dark-color' } },
      theme: 'dark',
    })).toBe('Jane uses dark-color and {missing}');
  });

  it('renders fallback content when the message has no template key', () => {
    render(<TemplateMessageItemBody className="custom-class" message={createMessage()} isByMe />);

    expect(screen.getByText('fallback text')).toBeInTheDocument();
    expect(screen.getByText('fallback text').closest('.sendbird-template-message-item-body__fallback_message'))
      .toHaveClass('custom-class', 'outgoing');
  });

  it('renders fallback content when Sendbird state is unavailable', () => {
    mockSendbirdState = null;

    render(<TemplateMessageItemBody message={createMessage({ key: 'root-template' }, '')} />);

    expect(screen.getByText('(Template error)')).toBeInTheDocument();
    expect(screen.getByText('Cannot read this template.')).toBeInTheDocument();
  });

  it('renders cached root and simple templates with variables filled', () => {
    mockSendbirdState = createState({
      cachedTemplates: {
        root: {
          version: 2,
          colorVariables: { text: { color: 'light-color,dark-color' } },
          uiTemplate: JSON.stringify([{
            type: 'box',
            text: 'Hello {user.name} {text.color}',
            items: '@{cards}',
          }]),
        },
        card: {
          version: 1,
          colorVariables: {},
          uiTemplate: JSON.stringify([{ type: 'text', text: 'Card {card.title}' }]),
        },
      },
    });

    render(
      <TemplateMessageItemBody
        message={createMessage({
          key: 'root',
          variables: { user: { name: 'Jane' } },
          view_variables: {
            cards: [{ key: 'card', variables: { card: { title: 'One' } } }],
          },
        })}
        theme="dark"
      />,
    );

    const renderedTemplate = JSON.parse(screen.getByTestId('template-wrapper').textContent);
    expect(renderedTemplate.templateVersion).toBe(2);
    expect(renderedTemplate.templateItems[0].text).toBe('Hello Jane dark-color');
    expect(renderedTemplate.templateItems[0].items[0].version).toBe(1);
    expect(renderedTemplate.templateItems[0].items[0].body.items[0].text).toBe('Card One');
  });

  it('requests missing templates and renders loading state', () => {
    const updateMessageTemplatesInfo = jest.fn();
    jest.spyOn(Date, 'now').mockReturnValue(1234);
    mockSendbirdState = createState({ updateMessageTemplatesInfo });

    render(<TemplateMessageItemBody message={createMessage({ key: 'missing-template' })} isByMe />);

    expect(screen.getByTestId('sendbird-message-status-icon')).toBeInTheDocument();
    expect(updateMessageTemplatesInfo).toHaveBeenCalledWith(['missing-template'], 100, 1234);
  });

  it('does not retry a recently failed template request for another message', () => {
    const updateMessageTemplatesInfo = jest.fn();
    jest.spyOn(Date, 'now').mockReturnValue(1250);
    mockSendbirdState = createState({
      updateMessageTemplatesInfo,
      waitingTemplateKeysMap: {
        root: { requestedAt: 1000, erroredMessageIds: [99] },
      },
    });

    render(<TemplateMessageItemBody message={createMessage({ key: 'root' })} />);

    expect(screen.getByTestId('sendbird-message-status-icon')).toBeInTheDocument();
    expect(updateMessageTemplatesInfo).not.toHaveBeenCalled();
  });

  it('renders fallback when template fetching has already failed for the message', () => {
    const logger = { error: jest.fn() };
    mockSendbirdState = createState({
      logger,
      waitingTemplateKeysMap: {
        root: { requestedAt: 1000, erroredMessageIds: [100] },
      },
    });

    render(<TemplateMessageItemBody message={createMessage({ key: 'root' }, 'fallback after error')} />);

    expect(screen.getByText('fallback after error')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalled();
  });

  it('renders fallback when view variables are malformed', () => {
    const logger = { error: jest.fn() };
    mockSendbirdState = createState({
      logger,
      cachedTemplates: {
        root: {
          version: 1,
          colorVariables: {},
          uiTemplate: JSON.stringify([{ type: 'box', items: '@{cards}' }]),
        },
      },
    });

    render(
      <TemplateMessageItemBody
        message={createMessage({
          key: 'root',
          view_variables: {
            cards: {} as any,
          },
        }, 'malformed fallback')}
      />,
    );

    expect(screen.getByText('malformed fallback')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledWith(
      'TemplateMessageItemBody | received view_variables is malformed: ',
      expect.objectContaining({ key: 'root' }),
    );
  });
});
