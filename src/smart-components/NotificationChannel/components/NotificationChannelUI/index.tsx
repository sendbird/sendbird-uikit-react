import './notification-channel-ui.scss';

import React from 'react';

import NotificationList from '../NotificationList';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { renderMessage, renderMessageHeader } from '../../types';
import { useNotficationChannelContext } from '../../context/NotificationChannelProvider';

export type NotificationChannelUIProps = {
  isLoading?: boolean;
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  renderMessageHeader?: renderMessageHeader;
  renderMessage?: renderMessage;
}

export default function index({
  isLoading,
  renderPlaceholderLoader,
  renderPlaceholderInvalid,
  renderPlaceholderEmpty,
  renderMessageHeader,
  renderHeader,
  renderMessage,
}: NotificationChannelUIProps) {
  const { uiState } = useNotficationChannelContext();
  if (isLoading || uiState === 'loading') {
    return (
      <div className="sendbird-notification-channel" data-notificationuistate="loading">
        { renderHeader?.() || null }
        {
          renderPlaceholderLoader?.() || (
            <PlaceHolder
              type={PlaceHolderTypes.LOADING}
              className="sendbird-notification-channel__placeholder"
            />
          )
        }
      </div>
    )
  }

  if (uiState === 'invalid') {
    return (
      <div className="sendbird-notification-channel" data-notificationuistate="invalid">
        { renderHeader?.() || null }
        {
          renderPlaceholderInvalid?.() || (
            <PlaceHolder
              type={PlaceHolderTypes.WRONG}
              className="sendbird-notification-channel__placeholder"
            />
          )
        }
      </div>
    )
  }
  return (
    <div className="sendbird-notification-channel">
      { renderHeader?.() || null }
      <NotificationList
        renderPlaceholderEmpty={renderPlaceholderEmpty}
        renderMessageHeader={renderMessageHeader}
        renderMessage={renderMessage}
      />
    </div>
  );
}
