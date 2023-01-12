import React from 'react';

import NotificationList from '../NotificationList';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { renderMessage } from '../../types';

export type NotificationChannelUIProps = {
  isLoading?: boolean;
  renderPlaceholderLoader?: () => React.ReactElement;
  renderPlaceholderInvalid?: () => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  renderMessage?: renderMessage;
}

export default function index({
  isLoading,
  renderPlaceholderLoader,
  renderPlaceholderInvalid,
  renderPlaceholderEmpty,
  renderHeader,
  renderMessage,
}: NotificationChannelUIProps) {
  if (isLoading) {
    return (
      <div className="sendbird-notification-channel">
        { renderHeader?.() || null }
        {
          renderPlaceholderLoader?.() || (
            <PlaceHolder type={PlaceHolderTypes.LOADING} />
          )
        }
      </div>
    )
  }
  return (
    <div className="sendbird-notification-channel">
      { renderHeader?.() || null }
      <NotificationList
        renderMessage={renderMessage}
      />
    </div>
  );
}
