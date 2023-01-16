import './notification-channel-ui.scss';

import React from 'react';

import NotificationList from '../NotificationList';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { renderMessage, renderMessageHeader } from '../../types';
import { useNotficationChannelContext } from '../../context/NotificationChannelProvider';
import Modal from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';
import { actionTypes } from '../../context/dux/actionTypes';
import { useLocalization } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import sendbirdSelectors from '../../../../lib/selectors';


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
  const {
    uiState,
    showDeleteModal,
    notificationsDispatcher,
    currentNotificationChannel,
    messageToDelete,
  } = useNotficationChannelContext();
  const { stringSet } = useLocalization();
  const store = useSendbirdStateContext();
  const deleteMessage = sendbirdSelectors.getDeleteMessage(store);
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
      {
        showDeleteModal && (
          <Modal
            type={ButtonTypes.DANGER}
            onCancel={() => {
              notificationsDispatcher({
                type: actionTypes.SHOW_DELETE_MODAL,
                payload: {
                  showDeleteModal: false,
                  message: null,
                },
              })
            }}
            onSubmit={() => {
              // @ts-ignore
              deleteMessage(currentNotificationChannel, messageToDelete).then(() => {
                notificationsDispatcher({
                  type: actionTypes.SHOW_DELETE_MODAL,
                  payload: {
                    showDeleteModal: false,
                    message: null,
                  },
                })
              });
            }}
            submitText={stringSet.MESSAGE_MENU__DELETE}
            titleText={stringSet.MODAL__DELETE_MESSAGE__TITLE}
          />
        )
      }
    </div>
  );
}
