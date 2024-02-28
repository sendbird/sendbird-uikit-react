import React from 'react';
import { parser, renderer } from '@sendbird/react-uikit-message-template-view';
import { createMessageTemplate } from '@sendbird/uikit-message-template';
import { MessageTemplateItem } from '../TemplateMessageItemBody/types';

export interface MessageTemplateProps {
  templateItems: MessageTemplateItem[];
}

const { MessageTemplate: CustomTemplate } = createMessageTemplate({
  parser,
  renderer,
  Container: ({ children }) => {
    return (
      <div
        className={[
          'sb-message-template__parent',
          'sendbird-message-template__root',
        ].join(' ')}
      >
        {children}
      </div>
    );
  },
});

export function MessageTemplate({ templateItems }: MessageTemplateProps) {
  return <CustomTemplate templateItems={templateItems} />;
}

export default MessageTemplate;
