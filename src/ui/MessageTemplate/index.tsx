import React from 'react';
import { parser, renderer } from '@sendbird/react-uikit-message-template-view';
import { type ComponentsUnion, createMessageTemplate } from '@sendbird/uikit-message-template';
import './index.scss';

export interface MessageTemplateProps {
  templateItems: ComponentsUnion['properties'][];
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
  return <CustomTemplate templateItems={templateItems}/>;
}

export default MessageTemplate;
