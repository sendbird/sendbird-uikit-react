import React from 'react';
import MessageItemMenu from '../index.tsx';

import { MenuRoot } from '../../ContextMenu';

export default { title: 'UI Components/MessageItemMenu' };

export const messageItemMenu = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <MenuRoot />
    <h4>Sent Text message</h4>
    <MessageItemMenu
      message={{
        sendingStatus: 'succeeded',
        message: 'Im copied message',
        messageType: 'user',
        isResendable: () => false,
      }}
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (message) => 10,
        getUndeliveredMemberCount: (message) => 0,
      }}
      isByMe
      contextMenuProps={{
        disabled: false,
        resendMessage: () => { alert('resend message')},
        showEdit: () => { alert('show edit')},
        showRemove: () => {alert('who remove')},
      }}
    />
    <h4>Failed Text Message</h4>
    <MessageItemMenu
      message={{
        sendingStatus: 'failed',
        message: 'Im copied message',
        messageType: 'user',
        isResendable: () => true,
      }}
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (message) => 10,
        getUndeliveredMemberCount: (message) => 0,
      }}
      isByMe
      contextMenuProps={{
        disabled: false,
        resendMessage: () => { alert('resend message')},
        showEdit: () => { alert('show edit')},
        showRemove: () => {alert('who remove')},
      }}
    />
    <h4>Sent File message</h4>
    <MessageItemMenu
      message={{
        sendingStatus: 'succeeded',
        message: 'Im copied message',
        messageType: 'file',
        isResendable: () => false,
      }}
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (message) => 10,
        getUndeliveredMemberCount: (message) => 0,
      }}
      isByMe
      contextMenuProps={{
        disabled: false,
        resendMessage: () => { alert('resend message')},
        showEdit: () => { alert('show edit')},
        showRemove: () => {alert('who remove')},
      }}
    />
    <h4>Failed File Message</h4>
    <MessageItemMenu
      message={{
        sendingStatus: 'failed',
        message: 'Im copied message',
        messageType: 'file',
        isResendable: () => true,
      }}
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (message) => 10,
        getUndeliveredMemberCount: (message) => 0,
      }}
      isByMe
      contextMenuProps={{
        disabled: false,
        resendMessage: () => { alert('resend message')},
        showEdit: () => { alert('show edit')},
        showRemove: () => {alert('who remove')},
      }}
    />
    <h4>Received Text message</h4>
    <MessageItemMenu
      message={{
        sendingStatus: 'none',
        message: 'Im copied message',
        messageType: 'user',
        isResendable: () => false,
      }}
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (message) => 10,
        getUndeliveredMemberCount: (message) => 0,
      }}
      contextMenuProps={{
        disabled: false,
        resendMessage: () => { alert('resend message')},
        showEdit: () => { alert('show edit')},
        showRemove: () => {alert('who remove')},
      }}
    />
    <h4>Received File message</h4>
    <MessageItemMenu
      message={{
        sendingStatus: 'none',
        message: 'Im copied message',
        messageType: 'file',
        isResendable: () => false,
      }}
      channel={{
        isGroupChannel: () => true,
        getUnreadMemberCount: (message) => 10,
        getUndeliveredMemberCount: (message) => 0,
      }}
      contextMenuProps={{
        disabled: false,
        resendMessage: () => { alert('resend message')},
        showEdit: () => { alert('show edit')},
        showRemove: () => {alert('who remove')},
      }}
    />
  </div>
);
